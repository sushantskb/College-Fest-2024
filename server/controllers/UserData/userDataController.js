const User = require("../../../student database");

exports.searchRegisteredEvents = async (req, res) => {
  try {
    const userData = User.find(
      (data) => req.user.email.toLowerCase() === data.email.toLowerCase()
    );
    const rollno = userData.rollno;
    let myEvents = []; // { eventName: '', role: '', category: '' }
    let matchedRegistrations, totalRegistrations;

    // #region All Sports Registrations

    // Single
    const singleRegistrations =
      await require("../../models/Sports-Events/singleEvents").find();
    matchedRegistrations = singleRegistrations.filter(
      (registration) => registration.rollno === rollno
    );
    if (matchedRegistrations.length > 0) {
      matchedRegistrations.forEach((element) => {
        myEvents.push({
          eventName: element.event[0],
          role: "Solo",
          category: "Sports",
        });
      });
    }

    // Duo
    const doubleRegistrations =
      await require("../../models/Sports-Events/doubleEvents").find();
    // Lead
    matchedRegistrations = doubleRegistrations.filter(
      (registration) => registration.rollno === rollno
    );
    if (matchedRegistrations.length > 0) {
      matchedRegistrations.forEach((element) => {
        myEvents.push({
          eventName: element.event[0],
          role: "Lead",
          category: "Doubles Sports",
        });
      });
    }
    // Member
    matchedRegistrations = doubleRegistrations.filter(
      (registration) => registration.member_rollno === rollno
    );
    if (matchedRegistrations.length > 0) {
      matchedRegistrations.forEach((element) => {
        myEvents.push({
          eventName: element.event[0],
          role: "Member",
          category: "Doubles Sports",
        });
      });
    }

    // Team
    const teamRegistrations =
      await require("../../models/Sports-Events/teamEvents").find();
    // Lead
    matchedRegistrations = teamRegistrations.filter(
      (registration) => registration.rollno === rollno
    );
    if (matchedRegistrations.length > 0) {
      matchedRegistrations.forEach((element) => {
        myEvents.push({
          eventName: element.event[0],
          role: `Lead of ${element.team_name}`,
          category: "Sports",
        });
      });
    }
    // Member
    matchedRegistrations = teamRegistrations.filter((registration) =>
      registration.members.some((member) => member.rollno === rollno)
    );
    if (matchedRegistrations.length > 0) {
      matchedRegistrations.forEach((element) => {
        myEvents.push({
          eventName: element.event[0],
          role: `Member of ${element.team_name}`,
          category: "Sports",
        });
      });
    }
    // #endregion

    // #region All Solo Registrations
    // Single
    const soloRegistration =
      await require("../../models/otherEvents/soloRegistration").find();
    matchedRegistrations = soloRegistration.filter(
      (registration) => registration.rollno === rollno
    );
    if (matchedRegistrations.length > 0) {
      matchedRegistrations.forEach((element) => {
        myEvents.push({
          eventName: element.eventName,
          role: "Solo",
          category: element.category,
        });
      });
    }

    // #endregion

    // #region All Team Registrations

    const teamRegistration =
      await require("../../models/otherEvents/teamRegistration").find();

    // Lead
    matchedRegistrations = teamRegistration.filter(
      (registration) => registration.rollno === rollno
    );
    if (matchedRegistrations.length > 0) {
      matchedRegistrations.forEach((element) => {
        myEvents.push({
          eventName: element.eventName,
          role: `Lead of ${element.team_name}`,
          category: element.category,
        });
      });
    }

    // Member
    matchedRegistrations = teamRegistration.filter((registration) =>
      registration.members.some((member) => member.rollno === rollno)
    );
    if (matchedRegistrations.length > 0) {
      matchedRegistrations.forEach((element) => {
        myEvents.push({
          eventName: element.eventName,
          role: `Member of ${element.team_name}`,
          category: element.category,
        });
      });
    }
    // #endregion

    totalRegistrations = myEvents.length;
    const tableHeaders = myEvents.length > 0 ? Object.keys(myEvents[0]) : [];
    // console.log(myEvents);
    return res.render("myEvents", {
      loader_title_1: "All",
      loader_title_2: "Your",
      loader_title_3: "Registrations",
      myEvents,
      tableHeaders,
      myEvents,
      totalRegistrations,
    });
  } catch (error) {
    console.log(`Error occurred: ${error}`);
  }
};
