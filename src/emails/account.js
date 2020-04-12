const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'fireballfxp@gmail.com',
        subject: 'Welcome abord Task-manager!',
        text: `Hello ${name}, 
               Welcome to Task-Manager app, Let me know how you get along with the app.
        
        Have a great day!
        Task-manager team`
    })
}

const sendCancelAccountEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'fireballfxp@gmail.com',
        subject: 'Sorry to see you leaving Task-manager!',
        text: `Hello ${name}, 
               I was informed that you decided stop using Task-Manager app, 
               please Let me know if you had some trouble with the app.

        sincerely yours,
        Task-manager team`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelAccountEmail
}

// sgMail.send({
//     to: 'levch244@gmail.com',
//     from: 'fireballfxp@gmail.com',
//     subject: 'This is Hellow from node!',
//     text: 'I hope it has gotten to you'
// }).then(() => { }, error => {
//     console.error(error);

//     if (error.response) {
//         console.error(error.response.body)
//     }
// });