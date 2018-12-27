import React from 'react'
import PropTypes from 'prop-types'
import { Pagination as Page } from 'react-bootstrap'
import { Pages, pickMidIndex } from './helpers'

const {
  First, Prev, Item, Ellipsis, Next, Last,
} = Page

/**
 * 分页
 * @param  {Object} options.search   location.search
 * @param  {Number} options.page     当前页
 * @param  {Object} options.pageSize 分页数
 * @param  {Number} options.total    总页数
 * @param  {Number} options.showSize 显示按钮个数
 */
const Pagination = ({
  search, page, pageSize, total, showSize,
}) => {
  const pages = new Pages({
    search,
    currentPage: page,
    pageSize,
    totalSize: total,
  })

  const currentPage = pages.current()
  const firstPage = pages.first()
  const lastPage = pages.last()
  const prevPage = pages.prev()
  const nextPage = pages.next()
  const totalPage = pages.totalPage

  const midPages = pickMidIndex(page, totalPage, showSize)

  return (
    <Page style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
      <First href={firstPage} disabled={currentPage === prevPage} />
      <Prev href={prevPage} disabled={currentPage === prevPage} />
      {midPages[0] > 1 ? <Ellipsis /> : null}
      {midPages.map((p, k) => <Item key={k} href={pages.gen(p)} active={p === page}>{p}</Item>)}
      {midPages[midPages.length - 1] < totalPage ? <Ellipsis /> : null}
      <Next href={nextPage} disabled={currentPage === nextPage} />
      <Last href={lastPage} disabled={currentPage === nextPage} />
    </Page>
  )
}

Pagination.defaultProps = {
  search: {},
  page: 0,
  pageSize: 0,
  total: 0,
  showSize: 5,
}

Pagination.propTypes = {
  search: PropTypes.object,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
  showSize: PropTypes.number,
}

export default Pagination
