async function isAlreadyRegistered(rollno, eventName, Event) {
  try {
    const lead = await Event.findOne({ rollno: rollno, event: eventName });
    const duo = await Event.findOne({ member_roll: rollno, event: eventName });
    const member = await Event.findOne({
      members: { member_roll: rollno },
      event: eventName,
    });

    return lead || duo || member;
  } catch (error) {
    console.log(error);
    return res.redirect(`/`);
  }
}

async function alreadyRegistered(rollno, eventName, Model) {
  try {
    const lead = await Model.findOne({ rollno: rollno, eventName: eventName });
    const member = await Model.findOne({
      members: { rollno: rollno },
      eventName: eventName,
    });

    return lead || member;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { isAlreadyRegistered, alreadyRegistered };
