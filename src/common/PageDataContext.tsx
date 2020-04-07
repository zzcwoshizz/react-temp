import React, { useState } from 'react';

export const PageDataContext = React.createContext({});

interface Props {
  defaultPageData: any;
}

const PageDataProvider: React.SFC<Props> = props => {
  const [pageData, setPageData] = useState(props.defaultPageData || {});

  return (
    <PageDataContext.Provider
      value={{
        pageData,
        setPageData: _pageData => setPageData({ ...pageData, ..._pageData }),
      }}
    >
      {props.children}
    </PageDataContext.Provider>
  );
};

export default PageDataProvider;
