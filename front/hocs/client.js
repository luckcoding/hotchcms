import React from 'react'
import Event from 'helpers/event'

const CLIENT_LOADED = '$$CLIENT_LOADED';

function getComponentDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default App => {
  const componentDisplayName = getComponentDisplayName(App);

  class Client extends React.Component {
    static displayName = `ConnectClient(${componentDisplayName})`;

    static async getInitialProps(ctx) {
      let AppProps = {}

      if (App.getInitialProps) {
        AppProps = await App.getInitialProps(ctx);
      }

      const ClientEvent = new Event();
      ClientEvent.subscribe(CLIENT_LOADED, App.client)

      ClientEvent.broadcast(CLIENT_LOADED)

      return {
        ...AppProps,
      }
    }

    render () {
      if (typeof window !== 'undefined') {
        // console.log('=====>> broadcast')
        // console.log(this.props.broadcast)
        // this.props.ClientEvent.broadcast(CLIENT_LOADED)
      }

      return <App {...this.props} />
    }
  }

  return Client
}