import React from 'react';
import Auth from 'solid-auth-client';
import RDF from 'rdflib';
const store = RDF.graph();

class App extends React.Component {
  
  constructor (props) {
    super(props)

    this.state = {
      profile: '',
      session: ''
    }

    this.handleSession();
  }

  /**
   * Keep session up-to-date based on user status
   */
  handleSession() {
    Auth.trackSession(session => {
      this.setState({
        session
      });
    })
  };

  /**
   * Update user's profile
   * @param {*} e 
   */
  handleUpdate(e) {
    this.setState({
      profile: e.value
    });
  }

  /**
   * Call the login popup page
   * @param {*} e 
   */
  handleLogin(e) {
    let session = Auth.currentSession();
    let popupUri = 'popup.html';
    if (!this.state.session) {
      this.setState({
        session: Auth.popupLogin({ popupUri })
      });
    }
  }

  /**
   * Logout of user session
   * @param {*} e 
   */
  handleLogout(e) {
    Auth.logout()
  }

  /**
   * Display user profile details
   * @param {*} e 
   */
  handleView(e) {

    // Set up a local data store and associated data fetcher
    const me = store.sym(this.state.session.webId);
    console.log("me", me);

    const profile = me.doc();
    console.log("profile", profile);

    const VCARD = RDF.Namespace("http://www.w3.org/2006/vcard/ns#");
    console.log("vcard", VCARD);

    const fetcher = new RDF.Fetcher(store);
    console.log("fetcher store", fetcher);
    
    fetcher.load(profile).then(response => {
      let name = store.any(me, VCARD("fn"));
      console.log(`Loaded {$name || ‘wot no name?’}`);
    }, err => {
        console.log("load failed", err);
    });
    

    // TODO: Fetch user profile and display on code
    // Below logic needs replaced for NPM package usage no jquery.
    
    // console.log("name", )

    // const fullName = store.any($rdf.sym(person), FOAF('name'));
    // $('#fullName').text(fullName && fullName.value);
  
    // // Display their friends
    // const friends = store.each($rdf.sym(person), FOAF('knows'));
    // $('#friends').empty();
    // friends.forEach(async (friend) => {
    //   await fetcher.load(friend);
    //   const fullName = store.any(friend, FOAF('name'));
    //   $('#friends').append(
    //     $('<li>').append(
    //       $('<a>').text(fullName && fullName.value || friend.value)
    //               .click(() => $('#profile').val(friend.value))
    //               .click(loadProfile)));
    // });


    
  }

  
  renderLoginLogout() {
    return this.state.session
      ? (
        <section>
          <p id="logout">
            You are logged in as <span id="user">{this.state.profile}</span>.
            <button onClick={(e) => this.handleLogout(e)}>Log out</button>
          </p>
          <p>
            <label htmlFor="profile">Profile:</label>
            <input id="profile" value={this.state.session.webId} onChange={(e) => this.handleUpdate(e)}/>
            <button id="view" onClick={(e) => this.handleView(e)}>View</button>
          </p>
          <dl id="viewer">
            <dt>Full name</dt>
            <dd id="fullName"></dd>
            <dt>Friends</dt>
            <dd>
              <ul id="friends"></ul>
            </dd>
          </dl>
        </section>
      )
      : (
        <section>
          <p id="login">
            You are not logged in.
            <button onClick={(e) => this.handleLogin(e)}>Log in</button>
          </p>
         </section>
      )
  }

  render () {
    return (
      <div>
        <h1>Profile viewer</h1>
        { this.renderLoginLogout() }
      </div>
    )
  }
}

export default App;



