import React, { Component } from 'react'
import { request } from '../../lib'
import { Link } from 'react-router-dom'
import {
  Tabs,
  Badge
} from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const TabPane = Tabs.TabPane
const DPlayer = window.DPlayer
const site = 'http://abc.zyuanyuan.cn/'

const callback = (key) => {
  console.log(key)
}

export default class MovieDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      movie: null,
      relativeMovies: [],
      _id: this.props.match.params.id
    }
  }

  componentDidMount () {
    this._getMovieDetail()
  }

  _getMovieDetail = () => {
    console.log(window.__LOADING__)
    // request 使用问题：    request(window.__LOADING__)({
    request({
      method: 'get',
      url: `/movies/detail/${this.state._id}`
    }).then(res => {
      console.log(res)
      const movie = res.movie
      const relativeMovies = res.relativeMovies
      const video = site + movie.videoKey
      const pic = site + movie.coverKey

      this.setState({
        movie,
        relativeMovies
      }, () => {
        this.player = new DPlayer({
            container: document.getElementById('videoPlayer'),
            autoplay: false,
            video: {
                url: video,
                pic: pic,
                thumbnail: pic
            },
        })
      })
    }).catch(() => {
      this.setState({
        movie: []
      })

      this.props.history.goBack()
    })
  }


  render () {
    const { movie, relativeMovies } = this.state
    if(!movie) return null

    return (
        <div className='flex-row full'>
            <div className='page-shade'>
                <div className='video-wrapper'>
                    <div id='videoPlayer' data-src={site + movie.coverKey}
                        data-video={site+movie.videoKey} />
                </div>
                <div className='video-sidebar'>
                    <Link className='homeLink' to={'/'}>回到首页</Link>
                    <Tabs defaultActiveKey='1' onChange={callback}>
                        <TabPane tab='关于本片' key='1'>
                            <h1>{movie.title}</h1>
                            <dl>
                                <dt>豆瓣评分： <Badge count={movie.rate} style={{
                                    backgroundColor: '#52c41a'
                                }} /> 分</dt>
                                <dt>电影分类：{movie.tags && movie.tags.join(' ') }</dt>
                                <dt>更新时间：{moment(movie.meta.createdAt).fromNow()}</dt>
                                <dt>影片介绍：</dt>
                                <dd>{movie.summary}</dd>
                            </dl>
                        </TabPane>
                        <TabPane tab='同类电影' key='2'>
                        {
                            relativeMovies.map(item => (
                                <Link key={item._id} className='media' to={`/detail/${item._id}`}>
                                    <img width='60' className='align-self-center mr-3' src={site+item.posterKey} />
                                    <div className='media-body'>
                                        <h6 className='media-title'>{item.title}</h6>
                                        <ul className='list-unstyled'>
                                            {
                                                item.pubdate && item.pubdate.map((it, i) => (
                                                  <li key={i}>{moment(it.date).format('YYYY.MM')} {it.country}</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </Link>
                            ))
                        }
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    )
  }
}
