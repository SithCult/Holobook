//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Components
import { Post } from "../../molecules";

//> Redux Firebase
// Actions for posts
import {
  createPost,
  removePost,
  editPost,
  loadPosts,
  reportPost,
} from "../../../store/actions/postActions";
// Connect
import { connect } from "react-redux";
import { loadComments } from "../../../store/actions/commentActions";
import { MDBBtn } from "mdbreact";
//#endregion

//#region > Components
class Posts extends React.Component {
  state = {
    username: "",
    avatar: "",
    isUploading: false,
    progress: 0,
    avatarURL: "",
    basic: true,
    approvals: 0,
  };

  componentDidMount() {
    document.addEventListener("scroll", this.trackScrolling);
  }

  componentDidUpdate() {
    document.addEventListener("scroll", this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.trackScrolling);
    // Clear interval of re-fetching posts to prevent memory-leakage
    clearInterval(this.interval);
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById("profile");
    if (this.isBottom(wrappedElement)) {
      document.removeEventListener("scroll", this.trackScrolling);
      this.props.update();
    }
  };

  handlePopoverChange = (open) => {
    if (!open) {
      this.props.clearUser();
    }
  };

  render() {
    const { posts, auth, comments } = this.props;
    if (posts && auth) {
      let result = posts.map((post, i) => {
        return (
          <Post
            post={post}
            key={i}
            uid={post?.data?.author?.uid}
            comments={comments}
            removePost={this.props.removePost}
            load={() => this.props.load(this.props.posts.length)}
          />
        );
      });
      return result;
    } else {
      return false;
    }
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    postLoading: state.post.likeError,
    comments: state.comment.comments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removePost: (pid, uid) => dispatch(removePost(pid, uid)),
    loadComments: () => dispatch(loadComments()),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(Posts);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
