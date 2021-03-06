import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import $ from "jquery"
export default class DropList extends Component{
  state = {
    dropData:[],
    dropPosition: {x:"0px",y:"0px"},
    isexist: false
  }
  componentDidMount(){
    this.setState({
      dropData: this.props.dropData,
      dropPosition: this.props.dropPosition,
      isexist: this.props.isexist
    })
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      dropData: nextProps.dropData,
      dropPosition: nextProps.dropPosition,
      isexist: nextProps.isexist
    })
  }
  toNewPage = (url)=>{
    window.open(url)
  }
  addChild = ()=>{
    let childDom = ''
    if(this.state.isexist === true){
        childDom = <div
          className="drcontainer dropShow"
          style={{
            left: this.state.dropPosition.x,
            top: this.state.dropPosition.y
          }}
        >
          <ul>
          {
            this.state.dropData && this.state.dropData.length > 0?
            this.state.dropData.map((item)=>{

              let dom = ''
              if(item.key === 'downloadpackage'){
                dom = <li key={item.key}>
                        <div style={{minWidth: '120px',display:"inline-block"}} onClick={()=>item.onClick(item.param)}>{item.name}</div>
                      </li>
              }else{
                dom = <li key={item.key}>
                        <div style={{minWidth: '120px',display:"inline-block"}} onClick={()=>this.toNewPage(item.url)}>{item.name}</div>
                      </li>
              }
              return dom
            })
            :
            ''
          }
          </ul>
        </div>
    }
    return childDom
  }
  render(){
    // const xx = this.state.dropPosition.x
    // const yy = this.state.dropPosition.y
    // console.log(this.state.isexist)
    return(
      this.addChild()
    )
  }
}
