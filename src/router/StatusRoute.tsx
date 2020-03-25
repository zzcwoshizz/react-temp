import React from 'react';
import { Route } from 'react-router-dom';

const StatusRoute: React.SFC<{ code: number }> = props => {
  return (
    <Route
      render={({ staticContext }) => {
        // 客户端无staticContext对象
        if (staticContext) {
          // 设置状态码
          staticContext.statusCode = props.code;
        }
        return props.children;
      }}
    />
  );
};

export const StatusRoute_NotFound = () => (
  <StatusRoute code={404}>
    <h1>Not Found</h1>
  </StatusRoute>
);
