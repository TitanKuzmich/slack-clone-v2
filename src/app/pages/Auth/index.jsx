import React, {useState} from 'react'

import {errorMessage, methodTypes, validateAuthForm} from "pages/Auth/helper"
import {auth, db, providers} from "lib/firebase"

import GoogleLogin from "pages/GoogleLogin"

import style from './style.module.scss'

const DEFAULT_DATA = {
    email: "",
    password: "",
    confirm: ""
}

const Auth = () => {
    const [data, setData] = useState(DEFAULT_DATA)
    const [type, setType] = useState(methodTypes.signIn)
    const [error, setError] = useState("")

    const onChangeData = (e) => {
        setError("")

        setData({...data, [e.target.name]: e.target.value})
    }

    const signIn = () => {
        setError("")

        if (validateAuthForm(data, type)) {
            setError(validateAuthForm(data, type))
        } else {
            auth
                .signInWithEmailAndPassword(data.email, data.password)
                .then(({user}) => {
                    console.log(user)
                    db
                        .users
                        .doc(user.uid)
                        .update({
                            online: true
                        }, {
                            merge: true
                        })
                })
                .catch(() => setError(errorMessage.noUser))
        }
    }

    const signUp = () => {
        setError("")

        if (validateAuthForm(data, type)) {
            setError(validateAuthForm(data, type))
        } else {
            auth
                .createUserWithEmailAndPassword(data.email, data.password)
                .then(({user}) => {
                    console.log("from registration ",user)
                    db
                        .users
                        .doc(user.uid)
                        .set({
                            name: user.email,
                            role: "",
                            online: true
                        })
                })
                .catch(() => setError(errorMessage.signUpError))
        }
    }

    const signInGoogle = () => {
        auth.signInWithPopup(providers.google)
            .then(({user}) => {
                db
                    .users
                    .doc(user.uid)
                    .set({
                        name: user.displayName,
                        photoURL: user.photoURL,
                        role: "",
                        online: true
                    })
            })
            .catch(() => setError(errorMessage.signUpError))
    }

    const chooseMethod = () => {
        switch (type) {
            case methodTypes.signUp:
                signUp()
                break
            case methodTypes.signIn:
                signIn()
                break
            case methodTypes.google:
                signInGoogle()
                break
        }
    }

    const changeAuthMethod = (type) => {
        setData(DEFAULT_DATA)
        setError("")
        setType(type)
    }

    const authForm = () => {
        return (
            <>
                <div className={style.auth_content__input}>
                    <input
                        placeholder="Email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={onChangeData}
                    />
                </div>
                <div className={style.auth_content__input}>
                    <input
                        placeholder="Password"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={onChangeData}
                    />
                </div>
                {type === methodTypes.signUp && (
                    <div className={style.auth_content__input}>
                        <input
                            placeholder="Confirm password"
                            name="confirm"
                            type="password"
                            value={data.confirm}
                            onChange={onChangeData}
                        />
                    </div>
                )}
            </>
        )
    }

    return (
        <div className={style.auth_wrapper}>
            <div className={style.auth_container}>
                <div className={style.auth_header}>
                    {
                        (type === methodTypes.signIn || type === methodTypes.google)
                        && <span>Sign In to the TiSai Slack</span>
                    }

                    {type === methodTypes.signUp && <span>Sign Up to the TiSai Drive</span>}
                </div>

                <div className={style.auth_content}>
                    {type === methodTypes.google ? (
                        <GoogleLogin/>
                    ) : (
                        <>
                            {error && <div className={style.auth_content__error}>{error}</div>}
                            {authForm()}
                        </>
                    )}
                    <div
                        className={style.auth_content__submit}
                        onClick={chooseMethod}
                    >
                        {
                            (type === methodTypes.signIn || type === methodTypes.google)
                            && <span>Sign In</span>
                        }

                        {type === methodTypes.signUp && <span>Sign Up</span>}
                    </div>
                </div>

                <div className={style.auth_footer}>
                    {(type === methodTypes.signIn || type === methodTypes.google) && (
                        <p>
                            Don't have an account? Just&nbsp;
                            <span onClick={() => changeAuthMethod(methodTypes.signUp)}>Sign up</span>
                        </p>
                    )}
                    {(type === methodTypes.signUp || type === methodTypes.google) && (
                        <p>
                            Already have an account? Just&nbsp;
                            <span onClick={() => changeAuthMethod(methodTypes.signIn)}>Sign in</span>
                        </p>
                    )}
                    {type !== methodTypes.google && (
                        <p>
                            Or&nbsp;
                            <span onClick={() => changeAuthMethod(methodTypes.google)}>Sign in</span>
                            &nbsp;with Google
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Auth