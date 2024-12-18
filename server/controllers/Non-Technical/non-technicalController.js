const User = require("../../../student database");
const NonTechnicalEvents = require("../../models/otherEvents/events");
const SoloRegister = require("../../models/otherEvents/soloRegistration");
const TeamRegister = require("../../models/otherEvents/teamRegistration");
const { alreadyRegistered } = require("../../utils/checkDuplicate");

exports.initPage = async (req, res) => {
  // all non-tech -> 3 types
  try {
    return res.render("non-tech_events", {
      loader_title_1: "Here",
      loader_title_2: "Comes",
      loader_title_3: "Non-Technical",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.secondPage = async (req, res) => {
  // each of the 3 type
  const type = req.params.type;
  try {
    const infoErrorObj = req.flash("infoErrors");
    const infoRegisterObj = req.flash("infoRegister");
    let eventsData = await NonTechnicalEvents.find({
      category: "non-technical",
      ename: { $regex: new RegExp(type, "i") },
    });

    if (type === "others") {
      eventsData = await NonTechnicalEvents.find({
        category: "non-technical",
        $nor: [
          { ename: { $regex: new RegExp("lan-gaming", "i") } },
          { ename: { $regex: new RegExp("mobile-gaming", "i") } },
        ],
      });
    }

    return res.render("non-tech-details", {
      eventsData,
      type,
      loader_title_1: "Here",
      loader_title_2: "Comes",
      loader_title_3: type,
      infoErrorObj,
      infoRegisterObj,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/events/non-technical");
  }
};

exports.showPage = async (req, res) => {
  // registration form
  const eventName = req.params.event;
  const type = req.params.type;
  try {
    let eventData = await NonTechnicalEvents.find({
      category: "non-technical",
      ename: eventName,
    });
    eventData = eventData[0];

    const userData = User.find(
      (user) => user.email.toLowerCase() === req.user.email.toLowerCase()
    );
    const infoErrorObj = req.flash("infoErrors");
    const infoRegisterObj = req.flash("infoRegister");

    if (eventData.gender === "female" && userData.gender === "male") {
      req.flash("infoErrors", "Tum Ladke Ho");
      return res.redirect(`/events/non-technical/${type}`);
    }

    // console.log(eventData);
    // console.log(userData);

    const closed = [
      "essay-writing",
      "e-mail-writing",
      "lan-gaming-nfs",
      "lan-gaming-fifa",
      "mobile-gaming-free-fire",
      "biz-war",
      "tech-rodies",
      "mobile-gaming-bgmi",
      "gietu-spelling-bee",
      "treasure-hunt",
      "just-a-minute",
      "lan-gaming-valorant",
      "precise-writing",
      "techspeak-triumph",
      "digital-reel",
      "short-movie",
      "live-painting",
      "nail-painting",
      "mehendi"
    ];

    if (closed.includes(eventName)) {
      return res.render("close", {
        loader_title_1: "",
        loader_title_2: "Event",
        loader_title_3: "Closed",
      });
    }

    if (eventData.maxSize == 1) {
      // solo
      return res.render("register_solo_page", {
        csrfToken: req.csrfToken(),
        type,
        userData,
        infoErrorObj,
        infoRegisterObj,
        eventData,
        loader_title_1: "Non-Tech",
        loader_title_2: type,
        loader_title_3: eventName,
      });
    }

    return res.render("register_team_page", {
      csrfToken: req.csrfToken(),
      userData,
      eventData,
      type,
      infoErrorObj,
      infoRegisterObj,
      loader_title_1: "",
      loader_title_2: type,
      loader_title_3: eventName,
    });
  } catch (error) {
    console.log(error);
    return res.render(`/events/non-technical/${type}`);
  }
};

exports.registerUser = async (req, res) => {
  try {
    const eventData = await NonTechnicalEvents.findOne({
      ename: req.params.event,
    });
    const user = User.find(
      (x) => x.email.toLowerCase() === req.user.email.toLowerCase()
    );
    const payApp = req.body.payApp || "";
    const tid = req.body.tid || "";
    const size = req.body.size;

    if (eventData.maxSize == 1) {
      const temp2 = await alreadyRegistered(
        user.rollno,
        eventData.name,
        SoloRegister
      );
      if (temp2) {
        req.flash("infoErrors", "You are already registered");
        return res.redirect(
          `/events/non-technical/${req.params.type}/${req.params.event}`
        );
      } else {
        await SoloRegister.create({
          eventName: eventData.name,
          category: eventData.category,
          name: user.name,
          rollno: user.rollno,
          gender: user.gender,
          email: user.email,
          paymentApplication: payApp,
          transactionId: tid,
        });
        message = "Registered Successfully";
        req.flash("infoRegister", message);
        return res.redirect(
          `/events/non-technical/${req.params.type}/${req.params.event}`
        );
      }
    } else {
      const members = [];
      for (let i = 1; i < size; i++) {
        members.push({ rollno: req.body["rollno" + i] });
      }

      const memberData = [];

      for (let member of members) {
        const temp1 = User.find(
          (temp1) => member.rollno.toUpperCase() === temp1.rollno.toUpperCase()
        );

        if (!temp1) {
          // for db checking
          req.flash("infoErrors", `Data unavailable for ${member.rollno}.`);
          return res.redirect(
            `/events/non-technical/${req.params.type}/${req.params.event}`
          );
        } else if (user.rollno === temp1.rollno) {
          // user and member roll checking
          req.flash(
            "infoErrors",
            `Member Roll Number can't be your Roll Number`
          );
          return res.redirect(
            `/events/non-technical/${req.params.type}/${req.params.event}`
          );
        }
        // duplicate roll no for members
        const temp = memberData.find((x) => x.rollno === temp1.rollno);
        if (temp) {
          req.flash("infoErrors", `Duplicate Roll Number Found`);
          return res.redirect(
            `/events/non-technical/${req.params.type}/${req.params.event}`
          );
        }
        let d = {
          name: temp1.name,
          rollno: temp1.rollno,
          gender: temp1.gender,
          email: temp1.email,
        };

        memberData.push(d);
      }

      const lead = await alreadyRegistered(
        user.rollno,
        eventData.name,
        TeamRegister
      );
      const member = memberData.map((x) =>
        alreadyRegistered(x.rollno, eventData.name, TeamRegister)
      );

      const member_results = await Promise.all(member);

      if (lead || member_results.some((x) => x)) {
        console.log("here");
        message = `At least one member is already registered for ${eventData.name}`;
      } else {
        await TeamRegister.create({
          eventName: eventData.name,
          category: eventData.category,
          team_name: req.body.tname,
          name: user.name,
          rollno: user.rollno,
          members: memberData,
          gender: user.gender,
          email: user.email,
          paymentApplication: payApp,
          transactionId: tid,
        });
        message = "Registered Successfully";
      }

      req.flash("infoRegister", message);
      return res.redirect(
        `/events/non-technical/${req.params.type}/${req.params.event}`
      );
    }
  } catch (error) {
    console.log(error);
    req.flash("infoErrors", "Some Error Occured");
    return res.redirect(
      `/events/non-technical/${req.params.type}/${req.params.event}`
    );
  }
};
