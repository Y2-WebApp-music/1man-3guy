import React, { useRef, useEffect, useState } from "react";
import './ChatContent.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { auth } from '/src/DB/firebase-config.js'
import ModelSkeleton from "../Loading/ModelWait";
import axios from 'axios';


function ChatContent({LoadChat, onChatButtonClick, setChatList, chatId ,UserCurrent, ChatSelect, messages}) {
    const [ListText, setListText] = useState(null)
    const [userId, setUserID] = useState(UserCurrent)
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [newMessage, setNewMessage] = useState("")
    const EmptyChat = ''

    useEffect(() => {
        if (messages != null){
            setListText(messages.messages)
        } else {
            setListText(null)
        };
    }, [messages]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserID(user.uid);
            } else {
                setUserID(null);
            }
        });
        return () => unsubscribe();
    }, [userId]);

    const autoExpand = () => {
        const textarea = textareaRef.current;
        textarea.style.height = '1.5em';
        textarea.style.height = Math.min(textarea.scrollHeight, 170) + 'px';
    };
    const handleChange = () => {
        autoExpand();
    };
    useEffect(() => {
        autoExpand();
    }, [newMessage]);

    const handleKey = (e) =>{
        if (textareaRef.current && textareaRef.current.value === '') {
            e.target.parentElement.querySelector('button').setAttribute('disabled', 'disabled');
        } else {
            e.target.parentElement.querySelector('button').removeAttribute('disabled');
            e.code === "Enter" && handleSubmit()
        }
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (newMessage === "") return;
        let message = newMessage
        setNewMessage("")
        autoExpand()
        if (ListText === null){
            setListText([{who: 'user', text: message}])
            console.log('>> chatId << is : ',chatId)
        } else{
            setListText([...ListText,{who: 'user', text: message}])
        }
        try {
            const answer = await axios.post('http://127.0.0.1:5510/predict', {
                input: message
            });
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('wait 1 second DONE')
            if (chatId === null ){
                console.log('Create New Chat')
                try {
                    if (answer.data.prediction){
                        let result
                        let chatRoomC = {
                            name: "newChatRoom",
                            uid: userId,
                            TimeCreated: new Date(),
                            messages:[{who: 'user', text: message},{who: 'model', text: answer.data.prediction}]
                        }
                        const response = await fetch(`http://localhost:3100/addChatRoom?uid=${userId}&document=${chatRoomC}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(chatRoomC)
                        })
                        setLoading(false);
                        setListText([{who: 'user', text: message}, {who: 'model', text: answer.data.prediction}])
                        await new Promise(resolve => setTimeout(resolve, 500))
                        result = await response.json()
                        console.log(' From Empty ',result.insertedId)
                        ChatSelect(result.insertedId)
                        onChatButtonClick(result.insertedId, userId)
                        LoadChat(userId ,setChatList)
                    }
                } catch (error) {
                    console.error("Error adding document: ", error);
                }
            } else {
                let send
                try {
                    if (answer.data.prediction){
                        setLoading(false);
                        console.log('Predict : ',answer.data.prediction)
                        if (ListText === null){
                            setListText([{who: 'user', text: message}, {who: 'model', text: answer.data.prediction}])
                            send = [{who: 'user', text: message}, {who: 'model', text: answer.data.prediction}]
                        } else{
                            setListText([...ListText,{who: 'user', text: message}, {who: 'model', text: answer.data.prediction}])
                            send = [...ListText,{who: 'user', text: message}, {who: 'model', text: answer.data.prediction}]
                        }
                        await fetch(`http://localhost:3100/addMessage?id=${messages._id}&document=${send}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(send)
                        })
                    }
                } catch (error) {
                    console.error('Error making prediction:', error);
                }
            }
        } catch (error) {
            console.error('Error making prediction:', error);
        }
    }
    useEffect(() => {
        chatContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }, [ListText]);


    return(
        <>
            <div className="ChatContent-container">
                <div className="chat-container-scroll" >
                    <div className="chat-container-Empty" >
                        { ListText === null?(
                            <>
                            <div className="NewChat-Container">
                                <div>
                                    <h1>เริ่มใช้ 1Man&3Guy</h1>
                                </div>
                            </div>
                            </>
                        ):(
                                <div className="chat-container" id="scroller" ref={chatContainerRef}>
                                    {ListText.map((message,index) => (
                                        message.who === "model" ? (
                                            <ModelChat key={index} text={message.text} />
                                        ) : (
                                            <UserChat key={index} text={message.text} user={auth.currentUser.displayName} photoURL={auth.currentUser.photoURL} />
                                        )
                                    ))}
                                    {loading && <ModelSkeleton />}
                                    <div ref={chatContainerRef}></div>
                                </div>
                        )}
                    </div>
                </div>
                <div className="bottom-chat-input">
                    <form action="" onSubmit={handleSubmit} onKeyDown={handleKey} className="input-Container">
                        <textarea ref={textareaRef}
                            name="promptInput"
                            placeholder="คุยกับ 1MAN&3GUY............." id=""
                            onChange={(e) => {handleChange(e); setNewMessage(e.target.value);}}
                            value={newMessage}
                        ></textarea>
                        <button type="submit">
                            <FontAwesomeIcon icon={faPaperPlane} size="xl" style={{ color: newMessage ? 'white' : '' }} id="faPaperPlane"/>
                        </button>
                    </form>
                </div>
                <p className="warning">1Man&3Guy มีโอกาสผิดพลาดได้. กรุณาเช็คข้อมูลก่อนทุกครั้ง.</p>
            </div>
        </>
    )
}

function UserChat({ text,user, photoURL }) {
    return (
        <>
            <div className="UserChat-Container">
                <div className="UserChat-Container-Profile">
                    <p>{user}</p>
                    <img src={photoURL} alt="" />
                </div>
                <div dangerouslySetInnerHTML={{ __html: `${text}`.replace(/\n/g, '<br>') }} className="UserChat-text"/>
            </div>
        </>
    );
}

function ModelChat({ text }) {
    return (
        <>
        <div className="ModelChat-Container">
            <div className="ModelChat-Container-Profile">
                <img src="public/images/ModelPicture.jpg" alt="" />
                <p>1man&3guy</p>
            </div>
            <div className="ModelChat-text">
                <p>{text}</p>
            </div>
        </div>
        </>
    );
}

export default ChatContent