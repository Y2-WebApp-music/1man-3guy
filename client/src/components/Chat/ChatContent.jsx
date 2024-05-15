import React, { useRef, useEffect, useState } from "react";
import './ChatContent.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { auth, db } from '/src/DB/firebase-config.js'
import {addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy} from 'firebase/firestore'


function ChatContent({ ChatroomID, UserCurrent, ChatSelect}) {
    const [chatId, setChatId] = useState(ChatroomID)
    const [UserId, setUserId] = useState(UserCurrent)
    useEffect(() => {
        setChatId(ChatroomID);
        setUserId(UserCurrent);
    }, [ChatroomID])

    const textareaRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [newMessage, setNewMessage] = useState("")
    const messagesRef = collection(db, "messages")
    const [messages, setMessages] = useState([]);

    // const [messages, setMessages] = useState([
    //     {
    //         "text": "ดิฉันทำบ้านขายเมื่อประมาณปีมีถนนภายในซึ่งไม่ได้ยกให้เป็นทางสาธารณะแต่ก็ให้ลูกค้าใช้มาตลอดบางรายธนาคารของลูกค้าก็ขอให้จดภาระจำยอมให้บางรายก็ไม่ได้จดภาระจำยอมต่อมาเมื่อเดิอนตุลาคมมีคนซื้อบ้านต่อจากลูกค้าเดิมซึ่งบ้านหลังนี้อยู่ต้นซอยและผู้ซื้อได้ใช้บ้านต่อเติมเป็นศูนย์จำหน่ายนมมีรถเข้าออกมารับนมและรถบรรทุกนมมาส่งนมทำให้เกิดความไม่สะดวกในการเข้าออกของลูกค้าในหมู่บ้านลูกค้าได้มาร้องเรียนให้ดิฉันตักเตือนเรื่องการจอดรถและการนำรถเข้ามาส่งนมซึ่งบางครั้งมาเวลาตีสุนัขเห่าส่งเสียงรบกวนบ้านข้างเคียงซึ่งดิฉันได้แจ้งให้เค้าทราบตั้งแต่วันแรกท่ีได้ทราบว่าเค้าจะมาตั้งศูนย์จำหน่ายนมแล้วว่าให้เค้าเปิดประตูด้านหลังซึ่งเป็นซอยท่ีไม่ค่อยมีรถอย่าใช้ถนนด้านหน้าบ้านซึ่งจะทำให้ลูกค้าด้านในไม่สะดวกแต่เค้าก็ไม่ปฏิบัติตามดิฉันอยากทราบว่าหากดิฉันจะปิดถนนส่วนท่ีอยู่หน้าบ้านเค้าให้เค้าไปใช้ประตูด้านหลังซึ่งเค้าทำแล้วแต่ไม่ยอมใช้มีสิทธิ์ทำได้หรือไม่เพราะดิฉันไม่ได้จดภาระจำยอมให้เค้ากระรุณาตอบคำถามให้ด้วยนะคะคะ",
    //         "TimeAt": "2024-03-29T12:00:00Z",
    //         "user": "John Doe"
    //       },
    //       {
    //         "text": "ทนายคลายทุกข์ตอนนี้ดิฉันอายุปีสามีอายุปีเมียน้อยอายุประมาณปีไม่แน่ใจนะไม่เกินอะดิฉันคลอดลูกคนแรกมาเดือนกรกฏาคมทราบว่าเมียน้อยท้องอ่อนเมื่อเดือนตุลาคมหลังจากทราบจึงตกลงหย่ากับสามีเดือนตุลาคมเมียน้อย•คลอดลูกคนแรกมีนาคม•คลอดลูกคนที่ทองมีนาคมจดทะเบียนหย่าเดือนตุลาคมสามีนอกใจมีชู้จึงขอเลิกโดยมีสัญญาการเลี้ยงดูบุตรดังนี้ส่งเสียเลี้ยงดูบุตรบาทต่อเดือนหากลูกไม่สบายจะออกค่ารักษาคนละครึ่งสามีเก่าไม่มีความรับผิดชอบตามสัญญาดังกล่าวหมายเหตุตอนจดทะเบียนหย่าไม่ได้ระบุหนี้สินที่ต้องจ่ายคนละครึ่งซึ่งเกิดจากการแต่งงานและอยู่กินกันยอดทั้งหมดไม่เกินแสนบาทดิฉันอยากถามว่าถ้าเรียกค่าเลี้ยงดูย้อนหลังจะต้องทำอย่างไรบ้างเคยมีคนโทรมารุมด่าดิฉันพอดิฉันด่ากลับบ้างมีการอันเสียงไว้จะเกิดเป็นคดีมั้ยหากฝ่ายชายหันกลับมาจ่ายค่าเลี้ยงดูแต่อยากได้บุตรสาวไปเที่ยวด้วยทั้งนี้ถ้าดิฉันไม่อยากให้ไปเนื่องจากฝ่ายชายมีเมียน้อยเป็นภรรยาใหม่และมีลูกชายคนเพราะดิฉันไว้ใจเมียน้อยไม่ได้แน่นอนจะไม่ให้ไปได้มั้ยหากฝ่ายชายต้องการมาหามาเยี่ยมหรือพาไปเที่ยวได้แต่ต้องอยู่ในความดูแลของเราคือเราต้องฟังศาลรึเปล่าการเรียกค่าเลี้ยงดูจะต้องถึงขึ้นศาลมั้ยดิฉันเลี้ยงลูกคนเดียวมาตลอดปีหากต้องมีค่าใช้จ่ายจากการขึ้นศาลจะเท่าไรหากข้อไหนที่ดิฉันพลาดคำถามที่ถูกที่ควรขออภัยและโปรดแนะนำด้วย",
    //         "TimeAt": "2024-03-29T12:05:00Z",
    //         "user": "model"
    //       },
    //       {
    //         "text": "เมื่อวันที่ผมได้ลงมาจากคอนโดที่พักแถวปู่เจ้าสมิงพรายได้มีเจ้าหน้าที่ตำรวจมาจับกุมผมขณะเดินไปลานจอดรถทางเจ้าหน้าที่ขอตรวจค้นพบว่ามียาไอซ์ไว้ที่กระเป๋ากางเกงซึ่งผมก้อยอมรับคับว่ายานั้นเป็นของผมจิงแล้วตำรวจก้อพาไปค้นบ้นห้องอีกก้อเจอตาชั่งตัวถุงเปิดปิดใบถุงที่ใส่ยาของเก่ารวมยาไอซ์ที่เจอน้ำหนักที่ชั่งได้รวมถุงที่ชั้งด้วยคับถุงหนักประมาณซั้งในตอนแรกผมก้อรับว่าผมมีไว้เสพจิงเพราะต้องทำงานตอนกลางคืนแล้วเครื่องชั่งนี้ขนาดเท่ากล่องไม้ขีดก้อไดมาจากร้านขายของข้างๆร้านที่ผมขายอยู่แต่ตำรวจแจ้งข้อกล่าวหามาว่าผมมีไว่จำหน่ายแล้วได้ทำการตรวจยึดรถยนต์ฮอนด้าแจ๊ดสร้อยคอทองคำหนักบาทพร้อมพระเลี่ยมทองโทรศัพไอโฟทีสามอย่างเท่านั้นที่ลงบัญทึกประจำวันไว้โดยแยกสำนวจไว้ตั้งหากผมก้อเลยอยากทราบว่าของอย่างอื่นล่ะคับทำไมไม่ลงด้วยซึ่งก้อมีนาฬิกาข้อมือชายน้ำหอมกล้องส่องทางไกลกระเป๋าสตางใบไฟแช๊กซิบโปโทรศัพโนเกียทำไมไม่ได้ลงไว้คับแล้วในเมื่อผมไม่ได้ขายหรือโดนล่อซื้อยาไอซ์ทำไมเขาถึงต้องกล่าวข้อหาจำหน่ายให้ผมด้วยคับทั้งที่ปริมาณยาไม่น่าเกินมิลิกรัมอย่างแน่นอนแล้วถึงกับต้องยึดรถไว้เลยหรือคับตอนนี้ผมออกมาต่อสู้คดีอยู่รถไปตามที่สมุทรปราการเขาก้อให้ไปที่ปปสพอไปที่ปปสนี้ก้อผ่านไปจะเดือนแล้วรถผมต้องใช้ขนเสื้อผ้าเอาไปขายที่ตลาดทุกวันนี้ผมใช้แท๊กฑี่ค่าใช้จ่ายก้อเพิ่มมากขึ้นทุกทีลำบากไปหมดขอถามผู้รู้หน่อยคับผมจะมีวิธีการเอารถคืนมาโดยเร๊วได้อย่างไรคับรถเป็นชื่อของแม่ติดไฟแนนอยู่เหลืออีกปีก้อหมดแต่ทางไฟแนนต์ก้อได้ส่งยกเลิกสัญยาเช่ามาให้ที่บ้านแม่ซึ่งเราก้อเสียดายมากด้วยเพราะผ่อนมาตั้งปีแล้วมาโดนเรื่องไม่เป็นเรื่องมันเหมือนโดนรังแกมากจนผมอึดอัดใจไม่มีที่ปรึกษาส่วนในทางคดีผมต้องทำอย่างงัยคับเพราะตอนนี้จะใช้เงินแต่ล่ะทีก้อลำบากมากแล้วคับเลยยังไม่ตั้งทนายช่วยรบกวนท่านทั้งหลายมาตอบให้ทางสวางผมทีนะคับ",
    //         "TimeAt": "2024-03-29T12:10:00Z",
    //         "user": "John Doe"
    //       },
    //       {
    //         "text": "เอาเงินไปให้ญาติโดยญาติของเราเขาปล่อยกู้นอกระบบในโรงงานที่เขาทำงานอยู่เขาจ่ายให้เราร้อยละต่อเดือนเรามีสัญญาเงินกู้ที่ญาติลงลายมือชื่อแต่ไม่มีพยานเนื่องจากเชื่อใจกันการโอนเงินให้ญาติโอนเอทีเอ็มและญาติจ่ายดอกเรามาทางเอทีเอ็มต่อมาธุรกิจดีเราเลยชวนคนอื่นมาลงด้วยโดยเราได้ค่านายหน้าต่อเดือนเราไม่มีการทำสัญญาให้ลูกค้าบางทีให้ลูกค้าโอนเข้าบัญชีเราก่อนแล้วเราโอนให้ญาติหรือบางทีให้ลูกค้าโอนให้ญาติโดนตรงแต่การจ่ายดอกเบี้ยญาติจะโอนเข้าบัญชีเราก่อนเราจ่ายให้ลูกค้าอีกทอดหนึ่งพอหลังๆเราก็ลืมทำสัญญาเพิ่มจากเงินที่เอาไปดังนั้นถือว่าเรามีสัญญาไม่ครบจำนวนที่ให้เขาไปอย่างนี้หากเกิดปัญหาเราจะดำเนินการฟ้องเรียกเงินคืนและฟ้องอาญาได้ไหมคะ",
    //         "TimeAt": "2024-03-29T12:15:00Z",
    //         "user": "Jane Smith"
    //       },
    //       {
    //         "text": "บิดามีอาชีพขับรถส่งของให้บริษัทกซึ่งบิดาเป็นพนักงานของบริษัทกและมีอยู่วันหนึ่งบิดาไปส่งของให้กับนายขลูกค้าตามปกติแต่ปรากฎว่าไปส่งแล้วนายขลูกค้าให้ไปส่งอีกที่หนึ่งอยู่ที่โคราชแต่บิดาไม่มีเงินค่าน้ำมันบริษัทกจึงยืมเงินลูกค้าขให้เป็นเงินค่าน้ำมันจำนวนบาทบริษัทขได้ขอสำเนาบัตรประชาชนของบิดาไว้แล้วเซ็นชื่อรับเงินค่าน้ำมันไว้อยู่มาปียื่นขอคืนภาษีแต่ทางสรรพากรบอกมีรายได้อื่นๆอีกจากบริษัทขอีกบาทต้องได้รับเงินค่าภาษีคืนไม่เต็มจำนวนดิฉันติดต่อบริษัทขไปแล้วทำเนียนๆว่าจะรับผิดชอบให้ทุกบาทที่ไม่ได้รับคืนภาษีเต็มจำนวนแต่ระยะเวลาที่ดิฉันต้องรอเงินคืนอีกเดือนดิฉันสามารถเรียกร่องค่าทดแทนค่าขโมยชื่อไปเลี่ยงภาษีและค่าเสียเวลาได้หรือไม่คะ",
    //         "TimeAt": "2024-03-29T12:05:00Z",
    //         "user": "model"
    //       },
    //       {
    //         "text": "ได้รับแจ้งจากบประกันแห่งหนึ่งครั้งแรกโทรมาบอกว่าเราเป็นผู้ค้ำประกันให้ผู้ต้องหารายหนึ่งในคดีละเมิดลิขสิทธิ์เมื่อปีแจ้งชื่อผู้ต้องหามาซึ่งเราไม่รู้จักไม่ใช่ญาติพี่น้องเราแน่แต่เขามีสำเนาบัตรปชชและเบอร์มือถือเราด้วยซึ่งเราคาดว่าอาจเป็นคนรู้จักนำเอกสารไปใช้จึงบอกเขาไปว่าไม่รู้เรื่องเขาบอกว่าในเมื่อคุณไม่รู้เรื่องผมก็ไม่รู้จะคุยอะไรกับคุณวันนี้มีจดหมายลงทะเบียนมาเราเซ็นต์รับเองแจ้งว่าผู้ต้องหาหนีไม่ไปศาลๆสั่งปรับแสนบาทให้เราติดต่อกลับฝ่ายประกันอิสรภาพบประกันตอนนี้พยายามนึกว่าไปเกี่ยวข้องเมื่อไรค่อนข้างแน่ใจว่าไม่ได้ค้ำประกันใครซึ่งประเด็นนี้คงต้องขอเขาตรวจสอบเอกสารซึ่งถ้าเป้นรายเซ็นต์เราจริงๆก็คงต้องรับสภาพอยากสอบถามว่าเราควรทำอย่างไรต่อไปควรติดต่อกลับไปไหมควรเซ็นต์รับจดหมายอีกไหมบประกันจะทำการฟ้องเราต่อศาลใช่ไหมเราจะสามารถขอผ่อนชำระได้ไหมเพราะเงินแสนสำหรับเราแล้วเยอะมากๆไม่มีไปชดใช้เขาแล้วเป็นเรื่องที่เราไม่ได้ก่อด้วยจะมีการยึดทรัพย์ไหมกำลังจะซื้อรถยนต์ซึ่งเก็บเงินดาวน์มาทั้งชีวิต",
    //         "TimeAt": "2024-03-29T12:05:00Z",
    //         "user": "Jane Smith"
    //       },
    //       {
    //         "text": "บิดามีอาชีพขับรถส่งของให้บริษัทกซึ่งบิดาเป็นพนักงานของบริษัทกและมีอยู่วันหนึ่งบิดาไปส่งของให้กับนายขลูกค้าตามปกติแต่ปรากฎว่าไปส่งแล้วนายขลูกค้าให้ไปส่งอีกที่หนึ่งอยู่ที่โคราชแต่บิดาไม่มีเงินค่าน้ำมันบริษัทกจึงยืมเงินลูกค้าขให้เป็นเงินค่าน้ำมันจำนวนบาทบริษัทขได้ขอสำเนาบัตรประชาชนของบิดาไว้แล้วเซ็นชื่อรับเงินค่าน้ำมันไว้อยู่มาปียื่นขอคืนภาษีแต่ทางสรรพากรบอกมีรายได้อื่นๆอีกจากบริษัทขอีกบาทต้องได้รับเงินค่าภาษีคืนไม่เต็มจำนวนดิฉันติดต่อบริษัทขไปแล้วทำเนียนๆว่าจะรับผิดชอบให้ทุกบาทที่ไม่ได้รับคืนภาษีเต็มจำนวนแต่ระยะเวลาที่ดิฉันต้องรอเงินคืนอีกเดือนดิฉันสามารถเรียกร่องค่าทดแทนค่าขโมยชื่อไปเลี่ยงภาษีและค่าเสียเวลาได้หรือไม่คะ",
    //         "TimeAt": "2024-03-29T12:05:00Z",
    //         "user": "model"
    //       }
    //       ,
    //       {
    //         "text": "เอาเงินไปให้ญาติโดยญาติของเราเขาปล่อยกู้นอกระบบในโรงงานที่เขาทำงานอยู่เขาจ่ายให้เราร้อยละต่อเดือนเรามีสัญญาเงินกู้ที่ญาติลงลายมือชื่อแต่ไม่มีพยานเนื่องจากเชื่อใจกันการโอนเงินให้ญาติโอนเอทีเอ็มและญาติจ่ายดอกเรามาทางเอทีเอ็มต่อมาธุรกิจดีเราเลยชวนคนอื่นมาลงด้วยโดยเราได้ค่านายหน้าต่อเดือนเราไม่มีการทำสัญญาให้ลูกค้าบางทีให้ลูกค้าโอนเข้าบัญชีเราก่อนแล้วเราโอนให้ญาติหรือบางทีให้ลูกค้าโอนให้ญาติโดนตรงแต่การจ่ายดอกเบี้ยญาติจะโอนเข้าบัญชีเราก่อนเราจ่ายให้ลูกค้าอีกทอดหนึ่งพอหลังๆเราก็ลืมทำสัญญาเพิ่มจากเงินที่เอาไปดังนั้นถือว่าเรามีสัญญาไม่ครบจำนวนที่ให้เขาไปอย่างนี้หากเกิดปัญหาเราจะดำเนินการฟ้องเรียกเงินคืนและฟ้องอาญาได้ไหมคะ",
    //         "TimeAt": "2024-03-29T12:15:00Z",
    //         "user": "Jane Smith"
    //       },
    //       {
    //         "text": "บิดามีอาชีพขับรถส่งของให้บริษัทกซึ่งบิดาเป็นพนักงานของบริษัทกและมีอยู่วันหนึ่งบิดาไปส่งของให้กับนายขลูกค้าตามปกติแต่ปรากฎว่าไปส่งแล้วนายขลูกค้าให้ไปส่งอีกที่หนึ่งอยู่ที่โคราชแต่บิดาไม่มีเงินค่าน้ำมันบริษัทกจึงยืมเงินลูกค้าขให้เป็นเงินค่าน้ำมันจำนวนบาทบริษัทขได้ขอสำเนาบัตรประชาชนของบิดาไว้แล้วเซ็นชื่อรับเงินค่าน้ำมันไว้อยู่มาปียื่นขอคืนภาษีแต่ทางสรรพากรบอกมีรายได้อื่นๆอีกจากบริษัทขอีกบาทต้องได้รับเงินค่าภาษีคืนไม่เต็มจำนวนดิฉันติดต่อบริษัทขไปแล้วทำเนียนๆว่าจะรับผิดชอบให้ทุกบาทที่ไม่ได้รับคืนภาษีเต็มจำนวนแต่ระยะเวลาที่ดิฉันต้องรอเงินคืนอีกเดือนดิฉันสามารถเรียกร่องค่าทดแทนค่าขโมยชื่อไปเลี่ยงภาษีและค่าเสียเวลาได้หรือไม่คะ",
    //         "TimeAt": "2024-03-29T12:05:00Z",
    //         "user": "model"
    //       },
    //       {
    //         "text": "ได้รับแจ้งจากบประกันแห่งหนึ่งครั้งแรกโทรมาบอกว่าเราเป็นผู้ค้ำประกันให้ผู้ต้องหารายหนึ่งในคดีละเมิดลิขสิทธิ์เมื่อปีแจ้งชื่อผู้ต้องหามาซึ่งเราไม่รู้จักไม่ใช่ญาติพี่น้องเราแน่แต่เขามีสำเนาบัตรปชชและเบอร์มือถือเราด้วยซึ่งเราคาดว่าอาจเป็นคนรู้จักนำเอกสารไปใช้จึงบอกเขาไปว่าไม่รู้เรื่องเขาบอกว่าในเมื่อคุณไม่รู้เรื่องผมก็ไม่รู้จะคุยอะไรกับคุณวันนี้มีจดหมายลงทะเบียนมาเราเซ็นต์รับเองแจ้งว่าผู้ต้องหาหนีไม่ไปศาลๆสั่งปรับแสนบาทให้เราติดต่อกลับฝ่ายประกันอิสรภาพบประกันตอนนี้พยายามนึกว่าไปเกี่ยวข้องเมื่อไรค่อนข้างแน่ใจว่าไม่ได้ค้ำประกันใครซึ่งประเด็นนี้คงต้องขอเขาตรวจสอบเอกสารซึ่งถ้าเป้นรายเซ็นต์เราจริงๆก็คงต้องรับสภาพอยากสอบถามว่าเราควรทำอย่างไรต่อไปควรติดต่อกลับไปไหมควรเซ็นต์รับจดหมายอีกไหมบประกันจะทำการฟ้องเราต่อศาลใช่ไหมเราจะสามารถขอผ่อนชำระได้ไหมเพราะเงินแสนสำหรับเราแล้วเยอะมากๆไม่มีไปชดใช้เขาแล้วเป็นเรื่องที่เราไม่ได้ก่อด้วยจะมีการยึดทรัพย์ไหมกำลังจะซื้อรถยนต์ซึ่งเก็บเงินดาวน์มาทั้งชีวิต",
    //         "TimeAt": "2024-03-29T12:05:00Z",
    //         "user": "Jane Smith"
    //       },
    //       {
    //         "text": "บิดามีอาชีพขับรถส่งของให้บริษัทกซึ่งบิดาเป็นพนักงานของบริษัทกและมีอยู่วันหนึ่งบิดาไปส่งของให้กับนายขลูกค้าตามปกติแต่ปรากฎว่าไปส่งแล้วนายขลูกค้าให้ไปส่งอีกที่หนึ่งอยู่ที่โคราชแต่บิดาไม่มีเงินค่าน้ำมันบริษัทกจึงยืมเงินลูกค้าขให้เป็นเงินค่าน้ำมันจำนวนบาทบริษัทขได้ขอสำเนาบัตรประชาชนของบิดาไว้แล้วเซ็นชื่อรับเงินค่าน้ำมันไว้อยู่มาปียื่นขอคืนภาษีแต่ทางสรรพากรบอกมีรายได้อื่นๆอีกจากบริษัทขอีกบาทต้องได้รับเงินค่าภาษีคืนไม่เต็มจำนวนดิฉันติดต่อบริษัทขไปแล้วทำเนียนๆว่าจะรับผิดชอบให้ทุกบาทที่ไม่ได้รับคืนภาษีเต็มจำนวนแต่ระยะเวลาที่ดิฉันต้องรอเงินคืนอีกเดือนดิฉันสามารถเรียกร่องค่าทดแทนค่าขโมยชื่อไปเลี่ยงภาษีและค่าเสียเวลาได้หรือไม่คะ",
    //         "TimeAt": "2024-03-29T12:05:00Z",
    //         "user": "model"
    //       },
    //       {
    //         "text": "บิดามีอาชีพขับรถส่งของให้บริษัทกซึ่งบิดาเป็นพนักงานของบริษัทกและมีอยู่วันหนึ่งบิดาไปส่งของให้กับนายขลูกค้าตามปกติแต่ปรากฎว่าไปส่งแล้วนายขลูกค้าให้ไปส่งอีกที่หนึ่งอยู่ที่โคราชแต่บิดาไม่มีเงินค่าน้ำมันบริษัทกจึงยืมเงินลูกค้าขให้เป็นเงินค่าน้ำมันจำนวนบาทบริษัทขได้ขอสำเนาบัตรประชาชนของบิดาไว้แล้วเซ็นชื่อรับเงินค่าน้ำมันไว้อยู่มาปียื่นขอคืนภาษีแต่ทางสรรพากรบอกมีรายได้อื่นๆอีกจากบริษัทขอีกบาทต้องได้รับเงินค่าภาษีคืนไม่เต็มจำนวนดิฉันติดต่อบริษัทขไปแล้วทำเนียนๆว่าจะรับผิดชอบให้ทุกบาทที่ไม่ได้รับคืนภาษีเต็มจำนวนแต่ระยะเวลาที่ดิฉันต้องรอเงินคืนอีกเดือนดิฉันสามารถเรียกร่องค่าทดแทนค่าขโมยชื่อไปเลี่ยงภาษีและค่าเสียเวลาได้หรือไม่คะ",
    //         "TimeAt": "2024-03-29T12:05:00Z",
    //         "user": "model"
    //       }
    // ]);

    const autoExpand = () => {
        const textarea = textareaRef.current;
        textarea.style.height = '1.5em';
        textarea.style.height = Math.min(textarea.scrollHeight, 170) + 'px';
    };

    const handleChange = () => {
        autoExpand();
    };

    const handleKey = e=>{
        e.code === "Enter" && handleSubmit()
    }

    const chatRef = collection(db, "chatroom")

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (newMessage === "")return;
        if (chatId === null ){
            try {
                // let newChatRef = {id:37485698345 , chatname:"FromChatContent", userId:"BLHJRV489giuLGRIU24"}
                const  newChatRef = await addDoc(chatRef, {
                    chatname: "newChatRoom",
                    TimeAdd: serverTimestamp(),
                    userId: auth.currentUser.uid
                });
                setChatId(newChatRef.id);
                setUserId(auth.currentUser.uid);
                await addDoc(messagesRef, {
                    chatId: newChatRef.id,
                    text: newMessage,
                    TimeAt: serverTimestamp(),
                    userId: auth.currentUser.uid
                });
                ChatSelect(newChatRef.id)
                setNewMessage("")
                autoExpand();
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }else{
            await addDoc(messagesRef, {
                chatId: chatId,
                text: newMessage,
                TimeAt: serverTimestamp(),
                userId: auth.currentUser.uid
            });
            setNewMessage("")
            autoExpand();
        }
    }

    useEffect(() => {
        autoExpand();
    }, []);

    useEffect(() => {
        // console.log("useEffect query DB ==> messages")
        const queryMessage = query(messagesRef, where("chatId", "==", chatId),where("userId", "==", UserId), orderBy("TimeAt", "asc"));
        const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages);
            autoExpand();
        });
        return () => unsubscribe();
    }, [messages]);

    return(
        <>
            <div className="ChatContent-container">
                <div className="chat-container-scroll">
                    <div className="chat-container-Empty" ref={chatContainerRef}>
                        {chatId === null?(
                            <>
                            <div className="NewChat-Container">
                                <h1>How can I help you?</h1>
                            </div>
                            </>
                        ):(
                            <div className="chat-container">
                                {messages.map((message) => (
                                    message.user === "model" ? (
                                        <ModelChat key={message.id} text={message.text} />
                                    ) : (
                                        <UserChat key={message.id} text={message.text} user={auth.currentUser.displayName} photoURL={auth.currentUser.photoURL} />
                                    )
                                ))}
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
                        <button type="submit"> <FontAwesomeIcon icon={faPaperPlane} size="xl" id="faPaperPlane"/> </button>
                    </form>
                </div>
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
                <p className="UserChat-text">{text}</p>
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
            <p className="ModelChat-text">{text}</p>
        </div>
        </>
    );
}

export default ChatContent