import React from 'react'

import Header from "components/Header"
import Sidebar from "components/Sidebar"
import ChatArea from "components/ChatArea"

const HomeScreen = () => {
    return (
        <>
            <Header/>
            <div className='chat_wrapper'>
                <Sidebar/>

                <ChatArea/>
            </div>
        </>
    )
}

export default HomeScreen
