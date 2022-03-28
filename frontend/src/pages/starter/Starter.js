
import React from "react";
import { Link } from 'react-router-dom';

// styles
import useStyles from "./styles";
import reactLogo from "../../images/react-logo.svg";

import { Button } from "../../components/Wrappers";

function Starter() {
  let classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.starterBlock}>
        <img className={classes.img} src={reactLogo} alt='react' />
        <h3 className='my-3 align-self-center'>
          Welcome to your App One application!
        </h3>
        <p>
          This is a react/Node.JS(TypeORM) app generated by the{' '}
          <a href='https://flatlogic.com/generator'>
            Flatlogic Web App Generator
          </a>
          . For guides and documentation please check your local README.md and{' '}
          <a href='https://flatlogic.com/documentation'>
            Flatlogic documentation
          </a>
          .
        </p>
        <div className={classes.buttons}>
          <Link className={classes.a} to={'/login?tab=0'}>
            <Button
              className={classes.leftButton}
              type='submit'
              variant='contained'
              color='primary'
              size='large'
            >
              Login
            </Button>
          </Link>
        </div>
        <div className={classes.links}>
          <h5>More useful links</h5>
          <div>
            🌟
            <a target={"_blank"} href="https://reactjs.org/">
              {' '}
              ReactJS
            </a>
          </div>
          <div>
            ✨

            <a target={"_blank"} href="https://nodejs.org/en/">
              {' '}
              Node.js
            </a>

          </div>
          <div>
            💫
            <a target={"_blank"} href="https://flatlogic.com/forum/">
              {' '}
              Flatlogic Forum
            </a>
          </div>
          <div>
            ⭐
            <a target={"_blank"} href="https://mui.com/">
              {' '}
              Material-UI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Starter;
