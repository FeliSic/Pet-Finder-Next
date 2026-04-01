import { DataTypes, GeometryDataType, Model } from "sequelize";
import sequelizeClient from "./db";

// Interface Section -------------------------------------------------------------------------------------------------------------------

interface PetAttributes {
  id?: number;
  userId: number;
  userEmail: string;
  name: string;
  description: string; 
  active: boolean; 
  petStatus: string;
  lastSeen: string;
  latitude: number,
  longitude: number,
  imageUrl: string;
  lastReminderSent?: Date; 
  createdAt?: Date;
  updatedAt?: Date;
}

export class PetsFind extends Model<PetAttributes> implements PetAttributes {
  declare id?: number;
  declare userId: number;
  declare userEmail: string;
  declare name: string;
  declare description: string;
  declare active: boolean;
  declare petStatus: string;
  declare lastSeen: string; 
  declare latitude: number;
  declare longitude: number; 
  declare imageUrl: string;
  declare lastReminderSent: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

interface OwnerAttributes {
    id?: number;
    name?: string;
    email: string;
    telephone?: string;
    allowLocationNotifications: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Owner extends Model<OwnerAttributes> implements OwnerAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare telephone: string;
  declare allowLocationNotifications: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

interface AuthOwnerAttributes {
  id?: number;
  userId: number;
  code: string;
  expiration: Date;
}

export class AuthOwner extends Model<AuthOwnerAttributes> implements AuthOwnerAttributes {
  declare id: number;
  declare userId: number;
  declare code: string;
  declare expiration: Date;
}

interface UserLocationAttributes {
  id?: number;
  userId: number;
  latitude: number;   
  longitude: number;  
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserLocation extends Model<UserLocationAttributes> implements UserLocationAttributes {
  declare id?: number;
  declare userId: number;
  declare latitude: number;
  declare longitude: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

interface ReportNotificationAttributes {
  id?: number;
  reportId: number;
  userId: number;       
  notifiedAt?: Date;     
}

export class ReportNotification extends Model<ReportNotificationAttributes> implements ReportNotificationAttributes {
  declare id?: number;
  declare reportId: number;
  declare userId: number;
  declare notifiedAt?: Date;
}


//--------------------------------------------------------------------------------------------------------------------------------------

// Tables Section -------------------------------------------------------------------------------------------------------------------


PetsFind.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Owner_pets', // tabla users
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
      userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,  // true = reporte activo, false = encontrado o expirado
    },
    petStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // pending, approved, cancelled, etc.
  },
  lastSeen: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
    imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    lastReminderSent: {
    type: DataTypes.DATE,
     allowNull: true,        
    defaultValue: null,
  }
  },
  {
    sequelize: sequelizeClient,
    modelName: "Pets_Find",
    tableName: "pets",
    timestamps: true,
  }
)

//--------------------------------------------------------------------------------------------------------------------------------------

Owner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
      allowLocationNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeClient,
    modelName: "Owner",  
    tableName: "Owner_pets",
    timestamps: true,
  }
);

//--------------------------------------------------------------------------------------------------------------------------------------

AuthOwner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: Owner,
        key: 'id',
      },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeClient,
    modelName: 'AuthOwner',
    tableName: "Owner_Auths",
  }
);

//--------------------------------------------------------------------------------------------------------------------------------------

  UserLocation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Owner_pets',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    }, {
  sequelize: sequelizeClient,
  modelName: 'UserLocation',
  tableName: 'UserLocations',
  timestamps: true, // createdAt, updatedAt
});

//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------

  ReportNotification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pets',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Owner_pets',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      notifiedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
    sequelize: sequelizeClient,
    modelName: 'ReportNotification',
    tableName: 'ReportNotifications',
    timestamps: false, // no necesitamos createdAt/updatedAt, solo el campo notifiedAt
    // Para evitar duplicados (reportId + userId) puedes agregar un índice único si lo deseas
    indexes: [
      {
        unique: true,
        fields: ['reportId', 'userId'],
      },
    ],
  });

//--------------------------------------------------------------------------------------------------------------------------------------

// Relaciones

// ✅ Función para definir relaciones (se llama después)
function setupAssociations() {
  Owner.hasMany(PetsFind, { foreignKey: 'userId', as: 'pets' });
  PetsFind.belongsTo(Owner, { foreignKey: 'userId', as: 'owner' });

  Owner.hasOne(AuthOwner, { foreignKey: 'userId' });
  AuthOwner.belongsTo(Owner, { foreignKey: 'userId' });

  Owner.hasOne(UserLocation, { foreignKey: 'userId', as: 'location' });
  UserLocation.belongsTo(Owner, { foreignKey: 'userId', as: 'owner' });

  Owner.hasMany(ReportNotification, { foreignKey: 'userId', as: 'reportNotifications' });
  ReportNotification.belongsTo(Owner, { foreignKey: 'userId', as: 'owner' });

  PetsFind.hasMany(ReportNotification, { foreignKey: 'reportId', as: 'reportNotifications' });
  ReportNotification.belongsTo(PetsFind, { foreignKey: 'reportId', as: 'report' });
}

// ✅ Llamar a las relaciones
setupAssociations();

//--------------------------------------------------------------------------------------------------------------------------------------

// Sync Section ------------------------------------------------------------------------------------------------------------------------

// ✅ Solo exportá la función, NO la ejecutes automáticamente
// models.ts
let syncPromise: Promise<void> | null = null;

export async function syncDatabase() {
  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = (async () => {
    try {
      await sequelizeClient.sync();
      console.log("✅ Tablas sincronizadas");
    } catch (error) {
      console.error("❌ Error sincronizando tablas:", error);
      syncPromise = null;
      throw error;
    }
  })();

  return syncPromise;
}

    await syncDatabase();
//--------------------------------------------------------------------------------------------------------------------------------------


























































