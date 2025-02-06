module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, primaryKey: true
    },
    event_id: {
      type: DataTypes.INTEGER,
      references: { model: "events", key: "id" },
      onDelete: "CASCADE",
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    },{
      indexes: [
        {
          unique: true,
          fields: ["event_id", "user_id"],
        },
      ],
    }
  )

  return Booking;
}