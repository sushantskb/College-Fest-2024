const SwimEvent = require("../../models/Sports-Events/swimmingRegistration");
const SwimData = require("../../models/Sports-Events/swimming");
const WeightEvent = require("../../models/Sports-Events/weightLifting");
const User = require("../../../student database");
const Event = require("../../../eventsData");
const {
  isAlreadyRegistered,
  alreadyRegistered,
} = require("../../utils/checkDuplicate");

exports.initPage = async (req, res) => {
  try {
    const eventName = req.params.event;
    res.render("category_event", {
      loader_title_1: "Here",
      loader_title_2: "Comes",
      loader_title_3: "Category",
    });
  } catch (err) {
    console.log(err);
  }
};
exports.secondPage = async (req, res) => {
  try {
    const eventName = "swimming";
    const eventData = await SwimData.find({});
    console.log(eventName);
    if (eventName === "swimming") {
      return res.render("swimming-details", {
        loader_title_1: "Here",
        loader_title_2: "Comes",
        loader_title_3: "Category",
        eventData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.showPagePower = (req, res) => {
  try {
    const eventName = "powerlifting";
    const infoErrorObj = req.flash("infoErrors");
    const infoRegisterObj = req.flash("infoRegister");
    const userData = User.find(
      (x) => x.email.toLowerCase() === req.user.email.toLowerCase()
    );
    const eventData = Event.find((x) => x.name === eventName);
    console.log(eventData);

    return res.render("close", {
      csrfToken: req.csrfToken(),
      loader_title_1: "Event",
      loader_title_2: "Sports",
      loader_title_3: eventName,
      eventName,
      infoErrorObj,
      infoRegisterObj,
      userData,
      fees: "Free",
      eventData,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.showPageSwim = async (req, res) => {
  try {
    const eventName = req.params.event;
    const infoErrorObj = req.flash("infoErrors");
    const infoRegisterObj = req.flash("infoRegister");
    const userData = User.find(
      (x) => x.email.toLowerCase() === req.user.email.toLowerCase()
    );
    let eventData = await SwimData.find({ ename: eventName });
    eventData = eventData[0];
    // console.log(eventName);
    // console.log(eventData.minSize);
    // console.log(eventData);
    if (eventData.minSize == "4") {
      return res.render("close", {
        csrfToken: req.csrfToken(),
        loader_title_1: "Event",
        loader_title_2: "Sports",
        loader_title_3: eventName,
        eventName,
        infoErrorObj,
        infoRegisterObj,
        userData,
        fees: "Free",
        eventData,
      });
    }
    return res.render("register-swim-solo", {
      csrfToken: req.csrfToken(),
      loader_title_1: "Event",
      loader_title_2: "Sports",
      loader_title_3: eventName,
      eventName,
      infoErrorObj,
      infoRegisterObj,
      userData,
      fees: "Free",
      eventData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.registerUserPower = async (req, res) => {
  try {
    const event = "powerlifting";
    const user = User.find(
      (x) => x.email.toLowerCase() === req.user.email.toLowerCase()
    );
    const temp = await alreadyRegistered(user.rollno, event, WeightEvent);
    if (temp) {
      req.flash("infoErrors", "Already Reagistered");
      return res.redirect("/events/sports/category/powerlifting");
    }
    const data = await WeightEvent.create({
      name: user.name,
      rollno: user.rollno,
      email: user.email,
      gender: user.gender,
      event: event,
      category: req.body.category,
    });
    req.flash("infoRegister", "Registered Successfully");
    return res.redirect("/events/sports/category/powerlifting");
  } catch (error) {
    console.log(error);
    req.flash("infoErrors", "Some Error Occured");
    res.redirect("/events/sports/category/powerlifting");
  }
};

exports.registerUserSwim = async (req, res) => {
  try {
    const event = req.params.event;
    const user = User.find(
      (x) => x.email.toLowerCase() === req.user.email.toLowerCase()
    );
    let eventData = await SwimData.find({ ename: event });
    eventData = eventData[0];
    if (eventData.maxSize === "1") {
      const temp = await alreadyRegistered(
        user.rollno,
        eventData.name,
        SwimEvent
      );
      if (temp) {
        req.flash("infoErrors", "Already Reagistered");
        return res.redirect(`/events/sports/category/swimming/${event}`);
      }
      await SwimEvent.create({
        name: user.name,
        rollno: user.rollno,
        email: user.email,
        event: eventData.name,
        gender: user.gender,
      });
      req.flash("infoRegister", "Registered Successfully");
      return res.redirect(`/events/sports/category/swimming/${event}`);
    } else {
      const size = req.body.size;
      const temp = await alreadyRegistered(
        user.rollno,
        eventData.name,
        SwimEvent
      );
      if (temp) {
        req.flash("infoErrors", "Already Reagistered");
        return res.redirect(`/events/sports/category/swimming/${event}`);
      }
      const members = [];
      for (let i = 1; i < size; i++) {
        members.push({ rollno: req.body["rollno" + i] });
      }
      const memberData = [];
      for (let member of members) {
        let users = User.find(
          (users) => member.rollno.toUpperCase() === users.rollno.toUpperCase()
        );
        if (!users) {
          req.flash(
            "infoErrors",
            `Incorrect Data. Please check and re-enter the data.`
          );
          return res.redirect(`/events/sports/category/swimming/${event}`);
        } else if (user.gender !== users.gender) {
          req.flash(
            "infoErrors",
            `Every Member must have same gender.Please check and re-enter the data`
          );
          return res.redirect(`/events/sports/category/swimming/${event}`);
        } else if (user.rollno === users.rollno) {
          req.flash("infoErrors", `Please Give Member Roll`);
          return res.redirect(`/events/sports/category/swimming/${event}`);
        }
        const temp1 = memberData.find((x) => x.rollno === users.rollno);
        if (temp1) {
          req.flash("infoErrors", `Duplicate Roll Number Found`);
          return res.redirect(`/events/sports/category/swimming/${event}`);
        }
        let d = { name: users.name, rollno: users.rollno };
        memberData.push(d);
      }

      const member = memberData.map((user1) =>
        alreadyRegistered(user1.rollno, eventData.name, SwimEvent)
      );

      const user2 = await alreadyRegistered(user.rollno, eventData.name, SwimEvent);
      const member_results = await Promise.all(member);

      // console.log(user2);
      // console.log(member_results);

      if (user2 || member_results.some((x) => x)) {
        console.log("now");
        message = `At least one member is already registered for ${event}`;
      } else {
        console.log("here");
        await SwimEvent.create({
          name: user.name,
          email: user.email,
          rollno: user.rollno,
          gender: user.gender,
          members: memberData,
          event: eventData.name,
        });
        console.log("success");
        req.flash("infoRegister", "Registered Successfully");
        return res.redirect(`/events/sports/category/swimming/${event}`);
      }
    }
  } catch (error) {
    console.log(error);
    req.flash("infoErrors", "Some Error Occured");
    return res.json({ message: "Some error occured" });
  }
};

async function swim() {
  try {
    await SwimData.insertMany([
      {
        name: "Free Style",
        distance: "50mtrs",
        minSize: "1",
        maxSize: "1",
        gender: "both",
        ename: "free-style-50mtrs",
      },
      {
        name: "Free Style",
        distance: "100mtrs",
        minSize: "1",
        maxSize: "1",
        gender: "both",
        ename: "free-style-100mtrs",
      },
      {
        name: "Back Stroke",
        distance: "50mtrs",
        minSize: "1",
        maxSize: "1",
        gender: "both",
        ename: "back-stroke",
      },
      {
        name: "Brest Stroke",
        distance: "50mtrs",
        minSize: "1",
        maxSize: "1",
        gender: "both",
        ename: "brest-stroke",
      },
      {
        name: "Butter Fly",
        distance: "50mtrs",
        minSize: "1",
        maxSize: "1",
        gender: "both",
        ename: "butter-fly",
      },
      {
        name: "4x50 mtrs relay Free Style",
        distance: "4x50mtrs",
        minSize: "4",
        maxSize: "4",
        gender: "both",
        ename: "4x50mtrs-relay",
      },
    ]);
    console.log("s");
  } catch (error) {
    console.log(error);
  }
}

// swim()
