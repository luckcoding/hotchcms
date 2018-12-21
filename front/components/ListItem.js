import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { getMediaUrl } from 'helpers'

const Wrapper = styled.div`
  display: flex;
  height: 143px;
  padding: 10px;
  position: relative;
  transition: all 0.2s linear;
  &:hover {
    box-shadow: 0 0 25px 2px rgba(0, 0, 0, 0.2);
  }
`

const Cover = styled.a`
  border-radius: 2px;
  display: flex;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 216px;

  img {
    height: 100%;
    transition: all 1s;

    &:hover {
      transform: scale(1.12);
    }
  }
`

const Tag = styled.a`
  background: #373737;
  border-radius: 1px;
  color: #fff;
  font-size: 13px;
  height: 20px;
  line-height: 20px;
  padding: 0 10px;
  text-align: center;
  text-decoration: none;
`

const Main = styled.div`
  margin-left: 10px;
  position: relative;
  flex: 1;
`

const Title = styled.a`
  text-decoration: none;
  h3 {
    color: #262626;
    display: block;
    font-size: 18px;
    line-height: 24px;
    margin-top: 8px;
    max-height: 48px;
    overflow: hidden;
    text-align: justify;
    transition: 0.5s;
    width: 100%;

    &:hover {
      color: #4d7fd0;
      cursor: pointer;
    }
  }
`

const Description = styled.p`
  color: #787878;
  font-size: 13px;
  letter-spacing: 0;
  line-height: 20px;
  margin-top: 3px;
  max-height: 40px;
  overflow: hidden;
  text-align: justify;
  width: 100%;
`

const Bar = styled.div`
  left: 0;
  bottom: 2px;
  color: #a7a7a7;
  font-size: 12px;
  line-height: 18px;
  position: absolute;
  width: 100%;

  a {
    color: #4285f4;
    padding: 0 6px;
  }
`

function ArticleListItem({
  url,
  cover,
  title,
  description,
  tag,
  category,
  date,
  author,
}) {
  return (
    <Wrapper>
      <Link href="/categories" passHref>
        <Cover>
          <img src={getMediaUrl(cover)} />
        </Cover>
      </Link>
      <Main>
        <Link href="/categories" passHref>
          <Tag>{tag}</Tag>
        </Link>
        <Link href={url} passHref>
          <Title>
            <h3>{title}</h3>
          </Title>
        </Link>
        <Description>{description}</Description>

        <Bar>
          <span>
            来自主题
            <a>{category}</a>
          </span>
          |
          <span>
            <a>{author}</a>
          </span>
          <span style={{ float: 'right' }}>{date}</span>
        </Bar>
      </Main>
    </Wrapper>
  )
}

export default ArticleListItem
