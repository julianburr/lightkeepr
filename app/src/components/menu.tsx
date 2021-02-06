import styled from "styled-components";
import { NavLink } from "react-router-dom";

import { useAuth } from "../hooks/@firebase";

const Container = styled.menu`
  & ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;

    & li {
      list-style: none;
      padding: 0;
      margin: 0 0.2rem;

      & a {
        padding: 0.6rem 0.8rem;
        border-radius: 0.2rem;
        text-decoration: none;
        font-weight: 600;
        font-size: 1.2rem;
        text-transform: uppercase;
        color: inherit;
        transition: background 0.2s;

        &:hover {
          background: #fafafa;
        }

        &.active {
          &,
          &:hover {
            background: #f4f4f4;
          }
        }
      }
    }
  }
`;

export function Menu() {
  const authUser = useAuth();
  return (
    <Container>
      <ul>
        {authUser && (
          <>
            <li>
              <NavLink exact to="/">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/usage">
                Usage
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/integrations">
                Integrations
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink exact to="/plans">
            Plans &amp; Pricing
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/docs">
            Docs
          </NavLink>
        </li>
      </ul>
    </Container>
  );
}
