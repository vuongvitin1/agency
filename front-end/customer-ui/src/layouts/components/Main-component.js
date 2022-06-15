import { Toolbar, Typography } from "@material-ui/core";
import React from "react";
import clsx from "clsx";
// import { AppBreadcrumbs } from "../../../components";

export default function ({ classes, children, open, setRef }) {
  return (
    <main
      className={clsx(classes.content, {
        [classes.contentShift]: open,
      })}
      ref={target => setRef(target)}
    >
      <Toolbar />
      {/* <AppBreadcrumbs /> */}
      {children}
    </main>
  );
}
