import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs, Button, Row, Col, Popconfirm } from 'antd'
import { router } from 'utils'
import { forEach } from 'lodash'
import { stringify } from 'qs'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import List from './components/List'

const { TabPane } = Tabs

const EnumPostStatus = {
  PUBLISHED: 1, // 已发布
  UNPUBLISH: 2, // 已下线
  DRAFT: 0, // 草稿
  TRASH: 9, // 回收站
}

const queryActive = function(status) {
  let active = String(EnumPostStatus.PUBLISHED)
  forEach(EnumPostStatus, value => {
    if (String(value) === status) {
      active = String(value)
    }
  })
  return active
}

@withI18n()
@connect(({ article, loading }) => ({ article, loading }))
class Article extends PureComponent {
  render() {
    const { article, loading, location, i18n, dispatch } = this.props
    const { list, pagination, selectedRowKeys } = article
    const { query, pathname } = location

    const handleRefresh = newQuery => {
      router.push({
        pathname,
        search: stringify(
          {
            ...query,
            ...newQuery,
          },
          { arrayFormat: 'repeat' }
        ),
      })
    }

    const listProps = {
      pagination,
      dataSource: list,
      loading: loading.effects['article/query'],
      onChange(page) {
        router.push({
          pathname,
          search: stringify({
            ...query,
            page: page.current,
            pageSize: page.pageSize,
          }),
        })
      },
      rowSelection: {
        selectedRowKeys,
        onChange: keys => {
          dispatch({
            type: 'media/updateState',
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
      },
    }

    const handleTabClick = key => {
      router.push({
        pathname,
        search: stringify({
          status: key,
        }),
      })
    }

    const onCreate = () => {
      dispatch({
        type: 'article/create',
      })
    }

    const handleDeleteItems = () => {
      handleRefresh()
    }

    return (
      <Page inner>
        {selectedRowKeys.length > 0 && (
          <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
            <Col>
              {`Selected ${selectedRowKeys.length} items `}
              <Popconfirm
                title="Are you sure delete these items?"
                placement="left"
                onConfirm={handleDeleteItems}
              >
                <Button type="primary" style={{ marginLeft: 8 }}>
                  Remove
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        )}
        <Tabs
          activeKey={queryActive(query.status)}
          onTabClick={handleTabClick}
          tabBarExtraContent={
            <Button type="primary" onClick={onCreate}>
              新建
            </Button>
          }
        >
          <TabPane tab={i18n.t`已发布`} key={String(EnumPostStatus.PUBLISHED)}>
            <List {...listProps} />
          </TabPane>
          <TabPane tab={i18n.t`已下线`} key={String(EnumPostStatus.UNPUBLISH)}>
            <List {...listProps} />
          </TabPane>
          <TabPane tab={i18n.t`草稿`} key={String(EnumPostStatus.DRAFT)}>
            <List {...listProps} />
          </TabPane>
          <TabPane tab={i18n.t`回收站`} key={String(EnumPostStatus.TRASH)}>
            <List {...listProps} />
          </TabPane>
        </Tabs>
      </Page>
    )
  }
}

Article.propTypes = {
  article: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Article
