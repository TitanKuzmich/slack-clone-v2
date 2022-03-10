export const errorMessage = {
    invalidEmail: "Invalid email address.",
    passwordsDontMatch: "Passwords don't match.",
    fieldsEmpty: "Please fill in all the fields.",
    shortPassword: "Password is too short. Minimum 5 symbols.",
    noUser: "There is no user with that email.",
    signUpError: "Something went wrong. Please try again later."
}

export const methodTypes = {
    signIn: "signIn",
    signUp: "signUp",
    google: "google"
}

export const isValidEmail = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(email)) {
        return false
    }

    const [name, host] = email.split("@")
    const zone = host.split(".").pop()

    return !(name.length >= 64 || host.length > 64 || (zone && zone?.length > 10))
}

export const validateAuthForm = (formData, type) => {
    if (formData.email && !isValidEmail(formData.email)) {
        return errorMessage.invalidEmail
    }

    if (!formData.email || !formData.password) {
        return errorMessage.fieldsEmpty
    }

    if (formData.password.length < 5) {
        return errorMessage.shortPassword
    }
    
    if(type === methodTypes.signUp && formData.password !== formData.confirm) {
        return errorMessage.passwordsDontMatch
    }
    
    return ""
}