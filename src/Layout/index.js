import { connect } from 'react-redux'
import Layout from './Layout'

const mapStateToProps = (state)=>({
  navWidth: state.nav.navWidth,
  collapsed: state.nav.collapsed
})

export default connect(mapStateToProps)(Layout)
