module.exports = (sequelize, DataTypes) => {
  const WaitingList = sequelize.define(
    "WaitingList", {
    id: {
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    event_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'events',
        key: 'id',
      }
    },
  },{
    indexes: [
      {
        unique: true,
        fields: ["event_id", "user_id"]
      },
    ],
  })
  return WaitingList;
}