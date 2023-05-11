require('dotenv').config();
const User = require("../models/user");
const passport = require("passport");
const randomSrring = require("randomstring");
const nodemailer = require("nodemailer");

module.exports.home = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return res.render("user", { t: "home" });
};

module.exports.profile = function (req, res) {
  return res.render("profile", { t: "profile" });
};

// befor for mail send smtp create krni h

module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("success", "password is not match");
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      req.flash("error", "error in finding user in sign up");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user signup");
          return;
        }
        // for verify mail send

        async function sendVerifyMail(email) {
          try {
            const transporter = nodemailer.createTransport({
              service: "gmail",
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              requireTLS: true,
              auth: {
                user: process.env.user,
                pass: process.env.pass,
              },
            });
            const mailOptions = {
              from: "sagar.ktech@gmail.com",
              to: email,
              subject: "message for user authentication in sign in",
              html: "<p>thankyou for , user authentication register your account in succesfully register </p>",
            };
            transporter.sendMail(mailOptions, function (err, info) {
              if (err) {
                console.log(err);
              } else {
                console.log("email has been sent ", info);
              }
            });
          } catch (err) {
            console.log(err);
            return;
          }
        }
        sendVerifyMail(user.email);
        req.flash("success", "user createated");
        return res.redirect("back");
      });
    } else {
      req.flash("error", "user is already create please sign in");
      res.redirect("back");
    }
  });
};

module.exports.create_session = function (req, res) {
  async function sendVerifyMail(email) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });
      const mailOptions = {
        from: "sagar.ktech@gmail.com",
        to: email,
        subject:
          "message for user authenticatiom in your account in succesfully login",
        html: "<p>thank you for , user authentication  your account in succesfully login </p>",
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("email has been sent ", info);
        }
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }
  sendVerifyMail(req.user.email);
  req.flash("success", "sign up sucesfully");
  return res.redirect("/profile");
};

module.exports.destrodesession = function (req, res, next) {
  async function sendVerifyMail(email) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.user,
           pass: process.env.pass,
        },
      });
      const mailOptions = {
        from: "sagar.ktech@gmail.com",
        to: email,
        subject:
          "message for user authenticatiom in properly log out succesfully",
        html: "<p>thank you for , user authentication  your account in succesfully logout </p>",
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("email has been sent ", info);
        }
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }
  sendVerifyMail(req.user.email);
 
  req.logout((error) => {
    if (error) {
      return next(error);
    } else {
      req.flash("success", "sign out successfully");
      return res.redirect("/");
    }
  });
};

module.exports.forgetpassword = function (req, res) {
  res.render("forget", { t: "forget password" });
};

const sendResetPasswordMail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });
    const mailOptions = {
      from: "sagar.ktech@gmail.com",
      to: email,
      subject: "for reset password",
      html: '<p>hi, please click here to <a href="https://graceful-plum-pocketbook.cyclic.app/forget-password?token='+token+'">reset </a>your password',
    };
    

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("email has been sent ", info);
      }
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
module.exports.passwordverified = async function (req, res) { 
  try {
    const email = req.body.email;

    // not user autherrized but reset password
    if(req.user===undefined)
    {
      const hrekrishna= await User.findOne({ email: email });
      if(hrekrishna)
      {
        const randomStringhello = randomSrring.generate();
      const Updateddata = await User.updateOne(
        { email: email },
        { $set: { token: randomStringhello } }
      );
      sendResetPasswordMail(hrekrishna.email,randomStringhello);
      req.flash("success","please check your email  and reset your  password");
      res.redirect("/");
      }
      else
      {
        req.flash("error","please enter your verify email ");
        res.redirect("/forget");
      }
    }
// user is actorized and send the email in personal email
    else
    {
      if(email===req.user.email)
      {
      const Userdata = await User.findOne({ email: email });
      if (Userdata) {
        const randomStringhello = randomSrring.generate();
        const Updateddata = await User.updateOne(
          { email: email },
          { $set: { token: randomStringhello } }
        );
        sendResetPasswordMail(Userdata.email,randomStringhello);
        req.flash("success","please check your email  and reset your  password");
        res.redirect("/profile");
      } else {
        req.flash("error", "user  email  is incorrect");
        res.redirect("/forget");
      }
      }
      else
      {
      req.flash("error", "please enter your  rightemail");
        res.redirect("/forget");
      }
    }

    
   
    
  } catch (err) {
    console.log(err);
    return;
  }
};

module.exports.forgetpasswordloaded=async(req,res)=>
{
    try
    {
        console.log(",ansaskjasjajsa");
        const token=req.query.token;
        // console.log("smansnandsdsds");
        // console.log(token);
        const tokenData=await User.findOne({token:token});
        if(tokenData)
        {
            res.render('forget-password',{id:tokenData,t:"reset password"});
        }
        else
        {
            req.flash('error',"please reset your password");
            res.redirect('/forget');
        }
    }
    catch(err)
    {
        console.log(err.message);
    }
}
module.exports.resetpassword=async(req,res)=>
{
    try
    {
        const password=req.body.password;
        const user_id=req.body.user_id;
        const update={ $set:{password:password,token:' '}};
         await   User.findOneAndUpdate(user_id, update, { returnOriginal: false }, function(err, result) {
            if (err) {
              console.log(err);
            } else {
                console.log("sansaksjkasa");
              console.log(result.value);
              res.render('confirm',{t:"mail send"});
            }
    })}
    catch(err)
    {
        console.log(err.message);
    }
}