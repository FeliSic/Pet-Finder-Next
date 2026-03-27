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
    createdAt?: Date;
    updatedAt?: Date;
}

export class Owner extends Model<OwnerAttributes> implements OwnerAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare telephone: string;
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

interface PushSubscriptionAttributes {
  id?: number;
  userId: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PushSubscription extends Model<PushSubscriptionAttributes> implements PushSubscriptionAttributes {
  declare id?: number;
  declare userId: number;
  declare endpoint: string;
  declare p256dh: string;
  declare auth: string;
  declare createdAt: Date;
  declare updatedAt: Date;
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
    }
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

PushSubscription.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    endpoint: { type: DataTypes.TEXT, allowNull: false },
    p256dh: { type: DataTypes.TEXT, allowNull: false },
    auth: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize: sequelizeClient,
    modelName: 'PushSubscription',
    tableName: 'push_subscriptions',
    timestamps: true,
  }
);

//--------------------------------------------------------------------------------------------------------------------------------------

// Relaciones

// ✅ Función para definir relaciones (se llama después)
function setupAssociations() {
  Owner.hasMany(PetsFind, { foreignKey: 'userId', as: 'pets' });
  PetsFind.belongsTo(Owner, { foreignKey: 'userId', as: 'owner' });

  Owner.hasOne(AuthOwner, { foreignKey: 'userId' });
  AuthOwner.belongsTo(Owner, { foreignKey: 'userId' });

  Owner.hasMany(PushSubscription, { foreignKey: 'userId' });
  PushSubscription.belongsTo(Owner, { foreignKey: 'userId' });
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


























































