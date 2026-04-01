// app/api/cron/notify-new-reports/route.ts
import { Op } from 'sequelize';
import { PetsFind, Owner, UserLocation, ReportNotification } from 'bknd/models/models';
import { sendNearbyReportEmail } from 'lib/resend_emails';
import sequelizeClient  from 'bknd/models/db'; // Ajusta la ruta

export async function GET() {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  const newReports = await PetsFind.findAll({
    where: {
      active: true,
      createdAt: { [Op.gte]: thirtyMinutesAgo }
    }
  });

  if (newReports.length === 0) {
    return new Response(JSON.stringify({ success: true, notified: 0 }), { status: 200 });
  }

  const userReportsMap = new Map<number, any[]>();

  for (const report of newReports) {
    const nearbyUsers = await UserLocation.findAll({
      include: [{
        model: Owner,
        as: 'owner',
        where: { allowLocationNotifications: true }
      }],
      where: sequelizeClient.literal(`ST_DWithin(
        ST_MakePoint(${report.longitude}, ${report.latitude})::geography,
        ST_MakePoint("UserLocation"."longitude", "UserLocation"."latitude")::geography,
        500
      )`)
    });

    for (const loc of nearbyUsers) {
      const userId = loc.userId;
      const alreadyNotified = await ReportNotification.findOne({
        where: { reportId: report.id!, userId }
      });
      if (!alreadyNotified) {
        if (!userReportsMap.has(userId)) userReportsMap.set(userId, []);
        userReportsMap.get(userId)!.push(report);
        await ReportNotification.create({ reportId: report.id!, userId });
      }
    }
  }

  for (const [userId, reports] of userReportsMap.entries()) {
    const owner = await Owner.findByPk(userId);
    if (owner && owner.email) {
      await sendNearbyReportEmail({
        userEmail: owner.email,
        userName: owner.name,
        reports: reports,
        reportCount: reports.length
      });
    }
  }

  console.log(`📧 Notificaciones de zona enviadas: ${userReportsMap.size} usuarios notificados`);
  return new Response(JSON.stringify({ success: true, notifiedUsers: userReportsMap.size }), { status: 200 });
}