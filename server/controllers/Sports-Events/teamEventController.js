const Event = require("../../models/Sports-Events/teamEvents");
const User = require("../../../student database");
const eventsData = require("../../../eventsData");
const { isAlreadyRegistered } = require("../../utils/checkDuplicate");

exports.showPage = (req, res) => {
  const eventName = req.params.event;
  const infoErrorObj = req.flash("infoErrors");
  const infoRegisterObj = req.flash("infoRegister");
  const userData = User.find(
    (user) => req.user.email.toLowerCase() === user.email.toLowerCase()
  );
  const eventData =
    eventsData.find((event) => eventName === event.name) || eventsData[13];

  if (eventName === "throwball" && userData.gender === "male") {
    req.flash("eventMessage", "Tum Ladke Ho");
    return res.redirect("/events/sports/teams");
  }

  const temp = ["tenniscricket", "gullycricket", "futsal"];

  const closed = [
    "4x100relay",
    "4x400relay",
    "tennisballcricket",
    "football",
    "khokho",
    "basketball",
    "volleyball",
    "throwball",
    "kabaddi",
    "futsal",
    "gullycricket",
    "tugofwar"
  ];

  if (temp.includes(eventName) && userData.gender === "female") {
    req.flash("eventMessage", "Didi ye kahan aa gaye aap");
    return res.redirect("/events/sports/teams");
  }

  let fees;
  if (eventName === "gullycricket" || eventName === "tennisballcricket") {
    fees = "300";
  } else if (
    (eventName === "basketball" && userData.gender === "male") ||
    eventName === "futsal"
  ) {
    fees = "200";
  } else if (eventName === "kabaddi" && userData.gender === "female") {
    fees = "Free";
  } else if (eventName === "volleyball" || eventName === "kabaddi") {
    fees = "100";
  } else {
    fees = "Free";
  }

  if (closed.includes(eventName)) {
    return res.render("close", {
      loader_title_1: "",
      loader_title_2: "Event",
      loader_title_3: "Closed",
    });
  }
  return res.render("registration_team", {
    csrfToken: req.csrfToken(),
    loader_title_1: "Event",
    loader_title_2: "Sports",
    loader_title_3: eventName,
    infoErrorObj,
    infoRegisterObj,
    eventName,
    userData,
    fees,
    eventData,
  });
};

exports.registerUsers = async (req, res) => {
  const event = req.params.event;
  let message = "";
  try {
    const payApp = req.body.payApp || "";
    const tid = req.body.tid || "";
    const size = req.body.size;

    console.log(size);

    const members = [];
    for (let i = 1; i < size; i++) {
      members.push({ rollno: req.body["rollno" + i] });
    }

    console.log(members);

    const leader = User.find(
      (user) => req.user.email.toLowerCase() === user.email.toLowerCase()
    );

    const memberData = [];
    for (let member of members) {
      let user = User.find(
        (user) => member.rollno.toUpperCase() === user.rollno.toUpperCase()
      );
      if (!user) {
        req.flash(
          "infoErrors",
          `Incorrect Data. Please check and re-enter the data.`
        );
        return res.redirect(`/events/sports/teams/${event}`);
      } else if (leader.gender !== user.gender) {
        req.flash(
          "infoErrors",
          `Every Member must have same gender.Please check and re-enter the data`
        );
        return res.redirect(`/events/sports/teams/${event}`);
      } else if (leader.rollno === user.rollno) {
        req.flash("infoErrors", `Please Give Member Roll`);
        return res.redirect(`/events/sports/teams/${event}`);
      }
      const temp = memberData.find((x) => x.rollno === user.rollno);
      if (temp) {
        req.flash("infoErrors", `Duplicate Roll Number Found`);
        return res.redirect(`/events/sports/teams/${event}`);
      }
      let d = { name: user.name, rollno: user.rollno };
      memberData.push(d);
    }

    const lead = await isAlreadyRegistered(leader.rollno, event, Event);
    const member = memberData.map((user) =>
      isAlreadyRegistered(user.rollno, event, Event)
    );

    const member_results = await Promise.all(member);

    if (lead || member_results.some((x) => x)) {
      message = `At least one member is already registered for ${event}`;
    } else {
      await Event.create({
        team_name: req.body.tname,
        lead_name: leader.name,
        rollno: leader.rollno,
        members: memberData,
        event: event,
        gender: leader.gender,
        paymentApplication: payApp,
        transactionId: tid,
      });
      message = "Registered Successfully";
    }

    req.flash("infoRegister", message);
    return res.redirect(`/events/sports/teams/${event}`);
  } catch (err) {
    console.error(err);
    req.flash("infoErrors", "Some Error Occured");
    return res.redirect(`/events/sports/teams/${event}`);
  }
};
