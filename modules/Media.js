import React from 'react'
import PropTypes from 'prop-types'
import json2mq from 'json2mq'

/**
 * Conditionally renders based on whether or not a media query matches.
 */
function withMediaQuery(query, WrappedComponent) {
  class Media extends React.Component {
    static propTypes = {
      defaultMatches: PropTypes.bool,
      query: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.arrayOf(PropTypes.object.isRequired),
      ]).isRequired,
      render: PropTypes.func,
      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    }

    static defaultProps = {
      defaultMatches: true,
    }

    state = {
      matches: this.props.defaultMatches,
    }

    updateMatches = () =>
      this.setState({ matches: this.mediaQueryList.matches })

    componentWillMount() {
      if (typeof window !== 'object') return

      if (typeof query !== 'string') query = json2mq(query)

      this.mediaQueryList = window.matchMedia(query)
      this.mediaQueryList.addListener(this.updateMatches)
      this.updateMatches()
    }

    componentWillUnmount() {
      this.mediaQueryList.removeListener(this.updateMatches)
    }

    render() {
      const { ...otherProps } = this.props
      const { matches } = this.state

      return <WrappedComponent matches={matches} {...otherProps} />
    }
  }
}
export default withMediaQuery
