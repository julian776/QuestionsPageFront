import React, { Fragment, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {BiHappyHeartEyes} from 'react-icons/bi'
import {MdMoodBad} from 'react-icons/md'
import {RiEmotionUnhappyLine} from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { URL_BASE } from '../utils/URL_BASE'


export const Question = ({ question, excerpt, onDelete }) => {

  const location = useLocation()
  const userId = useSelector(state => state.auth.uid)

  var listUsers = {}
  const data = func()

  var total = {
    feliz: 0,
    normal: 0,
    disgusto: 0
  }

  async function func(){
    try {
      const response = await fetch(
       `${URL_BASE}/votes/${question.id}`
      )
      return await response.json()
    } catch (error) {  
    }
  }

  const PromedioCaritas = () => {  
    var votos = total//calcularTotalVotos()
    let totalVotos = votos.feliz + votos.normal + votos.disgusto
    let toRender = <MdMoodBad />
    if(totalVotos.feliz >= total*0.65){
      toRender = <BiHappyHeartEyes />
    }
    else if(totalVotos.normal >= total*0.65){
      toRender = <MdMoodBad />
    }
    else if(totalVotos.disgusto >= total*0.65){
      toRender = <RiEmotionUnhappyLine />
    }
    return (
      <Fragment>
        Las personas han votado {toRender}
      </Fragment>
    )
  }
  
  async function handleVote(vote) {
    if(userId in listUsers){
      return ""
    }
    var voto = 0
    switch (vote) {
      case 2:
          voto=2
          break
        case 1:
          voto=1
          break
        case 0:
          voto = 0
          break
        default:
          voto = 2
    }
    await fetch(`${URL_BASE}/add/vote`,  {
      method: 'POST',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionId: question.id,
        userId:userId,
        voto: voto})
    })
  }

  return (
  <article className={excerpt ? 'question-excerpt' : 'question'}>
    <h2>{question.question}</h2>
    <h4 id='votos'>{location.pathname != '/questions' && PromedioCaritas()}</h4> 
    <p>
      {question.category}  - <small>{question.type}</small>
      {(location.pathname != '/questions' && location.pathname!='/list') &&
      <Fragment>
        <button onClick={() => handleVote(2)} className='button-vote'><BiHappyHeartEyes /></button>
        <button onClick={() => handleVote(1)} className='button-vote'><MdMoodBad /></button>
        <button onClick={() => handleVote(0)} className='button-vote'><RiEmotionUnhappyLine /></button>    
      </Fragment>
      }
    </p>

    {onDelete && (
      <button className="button right" onClick={() => onDelete(question.id)}>DELETE</button>
    )}
    {excerpt && (
      <Link to={`/question/${question.id}`} className="button">
        View Question
      </Link>
    )}
  </article>
)}