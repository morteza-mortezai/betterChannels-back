const Yup = require('yup')

exports.regSchema = Yup.object().shape({
    fullName: Yup.string().required().min(3).max(90),
    emailPhone: Yup.string("Enter your Email/Phone Number")
        // .email("Enter a valid email")
        .required("Email/Phone Number is required")
        .test('test-name', 'Enter Valid Phone/Email',
            function (value) {
                const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                const phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change this regex based on requirement
                let isValidEmail = emailRegex.test(value);
                let isValidPhone = phoneRegex.test(value);
                if (!isValidEmail && !isValidPhone) {
                    return false;
                }
                return true;
            }),
    password: Yup.string().required().min(8).max(255)
})