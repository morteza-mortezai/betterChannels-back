const Yup = require('yup')

exports.regSchema = Yup.object().shape({
    fullName: Yup.string().required().min(3).max(90),
    email: Yup.string("Enter your Email")
        // .email("Enter a valid email")
        .required("Email Number is required")
        .test('test-name', 'Enter Valid Email',
            function (value) {
                const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                let isValidEmail = emailRegex.test(value);
                if (!isValidEmail) {
                    return false;
                }
                return true;
            }),
    password: Yup.string().required().min(8).max(255)
})
        // const phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change this regex based on requirement