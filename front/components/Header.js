import React from 'react'
import styled from 'styled-components'
import LogoPNG from 'static/logo.png'
import Link from './Link'

const Wrapper = styled.header`
  background-color: rgba(0, 0, 0, .85);
  backdrop-filter: saturate(180%) blur(20px);

  position: sticky;
  top: 0;
  z-index: 1020;

  height: 48px;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled.img`
  height: 48px;
`

const Nav = styled.nav`
  a {
    padding: 10px 20px;

    color: #999;
    transition: ease-in-out color .15s;

    &:hover, &.active {
      color: #fff;
    }
  }
`

function Header() {
  return (
    <Wrapper>
      <Link href="/"><a><Logo src={LogoPNG} /></a></Link>
      <Nav>
        <Link activeClassName='active' href='/'>
          <a>Home</a>
        </Link>
        <Link activeClassName='active' href='/about'>
          <a>About</a>
        </Link>
      </Nav>
    </Wrapper>
  )
}

export default Header