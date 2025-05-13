const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    validate: {
      validator: function (email) {
        return (
          email === "" ||
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(String(email).toLowerCase())
        );
      },
      message: (props) => `'${props.value}' is not valid`,
    },
    index: true,
    sparse: true, //only indexes docs with value
    unique: true,
  },
  // phoneNo: {
  //     type: String,
  //     validate: {
  //         validator: function (no) {
  //             return no === '' || /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/.test(String(no));
  //         },
  //         message: (props) => `'${props.value}' is not valid`,
  //     },
  //     unique: true,
  //     index: true,
  //     sparse: true,
  // },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },

  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },

  password: {
    type: String,
    required: [true, "password is required"],
  },

  dateOfBirth: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },

  refreshToken: String,

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    default: "",
  },
  emailTokenExpiry: {
    type: Date,
    default: ()=>Date.now() + 1000 * 60 * 60, //1 hr 
  }
});

module.exports = mongoose.model("user", userSchema);
