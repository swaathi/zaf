'use strict';

const e = React.createElement;
const AUTHORIZATION = "Basic c3dhYXRoaUBza2NyaXB0LmNvbS90b2tlbjpTNVpTOTZQYXBBNXJJUW9xbTc3VHVVQ0ZDZlY5MndncUtRUDRleFpw";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      errorMessage: null,
      loading: true
    }
  }

  componentDidMount = () => {
    this.init();
  }

  init = () => {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '300px' });
    client.on('app.registered', app => {
      client.get('ticket.requester').then(data => {
        const requester = data['ticket.requester'];
        this.fetchEvents(requester.id);
      });
    });
  }

  fetchEvents = (requesterId) => {
    requesterId = 361741907720;
    var url = `https://z3n-developer.zendesk.com/api/sunshine/events?identifier=skcript:user_id:${requesterId}`;
    this.httpGet(url).then(function(data) {
      var events = data.data;
      this.setState({
        events,
        loading: false
      })
    }.bind(this)).catch(function(err) {
      console.log(err)
      this.setState({
        errorMessage: err.reason,
        loading: false
      })
    }.bind(this))
  }

  httpGet = (url) => {
    return new Promise(function (resolve, reject) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            resolve(response)
          } else if (this.readyState == 4 && this.status != 200) {
            var error = JSON.parse(xhttp.responseText);
            reject(error)
          }
      };
      xhttp.open("GET", url, true);
      xhttp.setRequestHeader("Authorization", AUTHORIZATION)
      xhttp.send();
    })

  }

  renderProperties = (properties) => {
    var propertiesDom = [];
    for(var key in properties) {
      var prop = e('small', {className: "loader"}, `${key}: ${properties[key]} `)
      propertiesDom.push(prop)
    }
    return propertiesDom;
  }

  renderEvent = (event, i) => {
    return e("li", {key: i},
      e("p", null, event.description),
      e("small", null, "Type: " + event.type),
      e("br"),
      e("small", null, "Properties: "),
      e("small", null, this.renderProperties(event.properties)),
      e("hr", null, null),
    )
  }

  render() {
    var events = this.state.events;
    var loading = this.state.loading;
    var errorMessage = this.state.errorMessage;

    if (loading) {
      return e('p', {className: "loader"}, "Loading...")
    }

    if (errorMessage) {
      return e('p', {className: "error"}, errorMessage)
    }

    if (events.length) {
      return e('ul', {className: "list"}, events.map(this.renderEvent))
    } else {
      return e('p', {className: "list"}, "No events yet.")
    }
  }
}

const domContainer = document.querySelector('#sidebar_container');
ReactDOM.render(e(Sidebar), domContainer);
