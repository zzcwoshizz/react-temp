import React from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  title: string;
}

const Head: React.SFC<Props> = props => {
  const { title } = props;

  return (
    <Helmet key="0">
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="shortcut icon" href="/static/favicon.ico" />
      <title>{title}</title>
    </Helmet>
  );
};

export default Head;
