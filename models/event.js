module.exports = (sequelize, DataTypes) => {

  const Event = sequelize.define(
    "Event", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    available_tickets: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  })

  Event.associate = ({WaitingList,Booking}) => {
    Event.hasMany(WaitingList, { foreignKey: 'event_id', as: 'waiting_list'});
    WaitingList.belongsTo(Event, { foreignKey: 'event_id' });
    
    Event.hasMany(Booking, { foreignKey: 'event_id', as: 'bookings'});
    Booking.belongsTo(Event, { foreignKey: 'event_id'});
  }

  return Event;
};