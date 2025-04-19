const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function (email) {
                return email === '' || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
                    String(email).toLowerCase()
                );
            },
            message: (props) => `'${props.value}' is not valid`,
        },
        index: true,
        sparse: true, //only indexes docs with value
        unique: true,
    },
    phoneNo: {
        type: String,
        validate: {
            validator : function (no) {
                return no === '' || /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/.test(String(no));
            },
            message: (props) => `'${props.value}' is not valid`,
        },
        unique: true,
        index: true,
        sparse: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },

    password: {
        type: String,
        required: [true, "password is required"],
      },

    refreshToken: String,
})

module.exports = mongoose.model('user', userSchema);