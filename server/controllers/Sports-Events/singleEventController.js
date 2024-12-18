const Event = require("../../models/Sports-Events/singleEvents");
const User = require("../../../student database");
const eventsData = require("../../../eventsData");
const {isAlreadyRegistered} = require("../../utils/checkDuplicate");

exports.showPage = async (req, res) => {
  try {
    const eventName = req.params.event;
    const infoErrorObj = req.flash("infoErrors");
    const infoRegisterObj = req.flash("infoRegister");
    const eventData =
      eventsData.find((event) => eventName === event.name) || eventsData[13];

    const userData = User.find(
      (data) => req.user.email.toLowerCase() === data.email.toLowerCase()
    );

    const notClosed = [
      
    ]

    // if (eventName === "lemonspoon" && userData.gender === "male") {
    //   return res.redirect("/events/sports/singles");
    // }

    if (eventName === "lemonspoon" && userData.gender === "male") {
      // Set a flash message
      req.flash("eventMessage", "Tum Ladke Ho");
      return res.redirect("/events/sports/singles");
    }

    let fees = "Free";

    if(notClosed.includes(eventName)){
      return res.render("register_solo", {
        csrfToken: req.csrfToken(),
        loader_title_1: "Event",
        loader_title_2: "Sports",
        loader_title_3: eventName,
        eventName,
        infoErrorObj,
        infoRegisterObj,
        userData,
        fees,
        eventData,
      });
    } else {
      return res.render("close", {loader_title_1: "", loader_title_2: "Event", loader_title_3: "Closed"});
    }

    
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

exports.registerUser = async (req, res) => {
  const event = req.params.event;
  let message = "";

  try {
    const payApp = req.body.payApp || "";
    const tid = req.body.tid || "";
    const user = User.find(
      (data) => req.user.email.toLowerCase() === data.email.toLowerCase()
    );

    // To check for the existence of the user with the same event
    const temp = await Event.findOne({ name: user.name, event: event });

    if (temp) {
      req.flash("infoErrors", "You are already registered");
      return res.redirect(`/events/sports/singles/${event}`);
    }

    const result = await isAlreadyRegistered(user.rollno, event, Event);

    if (result) {
      message = "Already Registered";
    } else {
      await Event.create({
        name: user.name,
        rollno: user.rollno,
        email: user.email,
        gender: user.gender,
        event: event,
        paymentApplication: payApp,
        transactionId: tid,
      });
      message = "Registered Successfully";
    }

    req.flash("infoRegister", message);
    return res.redirect(`/events/sports/singles/${event}`);
  } catch (error) {
    console.log(error);
    req.flash("infoErrors", error.message || "Error occurred");
    return res.redirect(`/events/sports/singles/${event}`);
  }
};
