import React, { Component } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import { withRouter } from 'react-router'

import { wyAxiosPost } from '../components/WyAxios'
import WyDatePicker from '../components/WyDatePicker'
import WySpin from '../components/WySpin'
import Column from '../components/Column'
//import contextList from '../SubPage/ContextList'

class TemplateForColumn extends Component{
  state={
    xData: [],
    yData: [],
    aUnit:'',

    isSpining: false,
    autoHeight: 300,
    subTime: [],
    showViewData:{},
    updateTime: 0,
    secondData:{}
  }

  //获取数据
  getCurViewData = ()=>{
    if(this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0){
      const info = _.cloneDeep(this.state.showViewData.data)
      info.viewType = this.state.showViewData.viewType
      info.pageId = this.props.pageId
      if(this.state.subTime.length>0 && this.props.env !== 'set'){
        info.start_time = this.state.subTime[0]
        info.last_time = this.state.subTime[1]
      }
      wyAxiosPost('Dashboard/getModuleData',{info},(result)=>{
        const responseData = result.data.msg
        console.log(responseData)
        if(this.state.subTime.length === 0){
          const curTime = []
          curTime.push(responseData.start_time)
          curTime.push(responseData.last_time)
          this.setState({
            xData: responseData.xxx,
            yData: responseData.yyy,
            aUnit: responseData.unit,
            subTime: _.cloneDeep(curTime),
            secondData: responseData.secondData?responseData.secondData:{}
          })
        }else{
          this.setState({
            xData: responseData.xxx,
            yData: responseData.yyy,
            aUnit: responseData.unit,
            secondData: responseData.secondData?responseData.secondData:{}
          })
        }
      })
    }
  }
  getCurViewDataForFresh = ()=>{
    if(this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0){
      const info = _.cloneDeep(this.state.showViewData.data)
      info.viewType = this.state.showViewData.viewType
      //info.api = this.state.showViewData.data.dataMethod

      wyAxiosPost('Dashboard/getModuleData',{info},(result)=>{
        const responseData = result.data.msg
        const curTime = []
        curTime.push(responseData.start_time)
        curTime.push(responseData.last_time)
        this.setState({
          xData: responseData.xxx,
          yData: responseData.yyy,
          aUnit: responseData.unit,
          subTime: _.cloneDeep(curTime),
          secondData: responseData.secondData?responseData.secondData:{}
        })
      })
    }
  }

  subTimeChange = (value,event)=>{
    this.setState({
      subTime: value
    },()=>{
      this.getCurViewData()
    })
  }
  //数据更新
  updateData = ()=>{
    if(this.columnTimer1){
      clearInterval(this.columnTimer1)
    }
    const run = ()=>{
      if(this.state.updateTime !== 0){
        if(this.columnTimer2){
          clearInterval(this.columnTimer2)
        }
        let time = this.state.updateTime
        this.columnTimer2 = setInterval(()=>{
          this.getCurViewDataForFresh()
        },time*1000)
        if(this.columnTimer1){
          clearInterval(this.columnTimer1)
        }
      }else{
        if(this.columnTimer2){
          clearInterval(this.columnTimer2)
        }
      }
    }
    this.columnTimer1 = setInterval(run,5000)
  }
  componentDidMount(){
    this.setState({
      showViewData: this.props.showViewData,
      autoHeight: this.props.autoHeight,
      updateTime: this.props.updateTime
    },()=>{
      this.getCurViewData()
      if(this.state.updateTime && this.props.env !== 'set'){
        this.updateData()
      }
    })
  }
  componentWillReceiveProps(nextProps){
    if(
      ! (_.isEqual(this.props.showViewData,nextProps.showViewData)) ||
      this.props.autoHeight !== nextProps.autoHeight ||
      (this.props.updateTime && nextProps.upDateTime && this.props.updateTime !== nextProps.upDateTime)
    ){
      this.setState({
        showViewData: nextProps.showViewData,
        autoHeight: nextProps.autoHeight,
        updateTime: nextProps.updateTime
      },()=>{
        this.getCurViewData()
        if(this.state.updateTime && this.props.env !== 'set'){
          this.updateData()
        }
      })
    }
  }
  componentWillUnmount(){
    if(this.columnTimer1){
      clearInterval(this.columnTimer1)
    }
    if(this.columnTimer2){
      clearInterval(this.columnTimer2)
    }
  }
  // chartContextmenu = (params,dom,position,viewId)=>{
  //   $('.drcontainer').removeClass('dropShow').addClass('dropHide')
  //   $(dom).closest('.gridContainer').find('.drcontainer').removeClass('dropHide').addClass('dropShow')
  //   if(this.state.secondData){
  //     const {listType,objType} = this.state.secondData
  //     let info ={
  //       listType,
  //       start_time: this.state.subTime[0],
  //       last_time: this.state.subTime[1],
  //       obj: params.name,
  //       objType,
  //       previousPath:this.props.location.pathname
  //     }
  //     this.props.setDropListInfo({
  //        dropData: contextList(info),
  //        dropPosition: {x:position.x+"px",y:position.y+"px"},
  //        isexist: true
  //     })
  //   }
  // }
  render(){
    return(
      <div className="amodule" style={{margin:"0px"}}>
      {
        this.props.env === 'set'?
        ''
        :
        <div className="moduleHeader" style={{display:"flex"}}>
          <div className="moduleHeaderIn"style={{flex:"1 1 auto"}}>
            {this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0?this.state.showViewData.data.moduleName:''}
          </div>
            <div style={{float: "right",flex:"0 0 300px"}}>
              <WyDatePicker curTime={this.state.subTime} rangeTimeChange={this.subTimeChange}/>
            </div>
        </div>
      }
        <div className="moduleBody">
          <WySpin isSpining={this.state.isSpining}>
            <Column
              xData={this.state.xData?this.state.xData:[]}
              yData={this.state.yData?this.state.yData:[]}
              aUnit={this.state.aUnit}
              height={this.state.autoHeight}
              //onContextmenu={this.chartContextmenu}
            />
          </WySpin>
        </div>
      </div>
    )
  }
}

export default withRouter(TemplateForColumn)
