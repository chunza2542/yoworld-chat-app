import React, {Component} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'

import {firestore} from '../core/client'
import {speak} from '../core/helper'
import {userLogout} from '../ducks/user'
import Card from '../components/Card'
import Navbar from '../components/Navbar'

const Container = styled.div`
  position: relative;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`

class Room extends Component {
  state = {
    users: [],
  }

  getAllUser = async () => {
    const docUser = await firestore.collection('users').get()
    // return only user json data
    const users = docUser.docs.map(user => user.data())
    // update state
    this.setState({users})
  }

  componentDidMount = () => {
    this.getAllUser()
    // update new user in realtime
    firestore.collection('users').onSnapshot({
      includeMetadataChanges: true,
    }, doc => {
      this.getAllUser()
    })
    // listen to new messages
    firestore.collection('messages').where('to_uid', '==', this.props.user.uid)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data()
            const {form, message, pitch, voice} = data
            // speak with speech api
            speak(message, pitch, voice)
            // display notification
          }
        })
      })
  }

  render() {
    const {displayName, photoURL} = this.props.user
    return (
      <Container>
        <Navbar logout={this.props.userLogout} displayName={displayName} photo={photoURL}/>
        <Grid>
          {this.state.users.map((user, i) => {
            return <Card user={user} key={`user_${i}`}/>
          })}
        </Grid>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.user
})

const mapDispatchToProps = dispatch => ({
  userLogout: () => dispatch(userLogout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Room)
