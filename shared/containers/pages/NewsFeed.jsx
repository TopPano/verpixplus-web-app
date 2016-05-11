'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadNewsFeed } from '../../actions/post';
import ScrollablePageContainer from './Scrollable.jsx';
import NewsFeed from '../../components/NewsFeed.jsx';

class NewsFeedPageContainer extends ScrollablePageContainer {
  static propTyes = {
    children: PropTypes.object.isRequired,
    newsFeed: PropTypes.object.isRequired,
    like: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    isRequestingFollow: PropTypes.bool.isRequired
  };

  hasMoreContent() {
    return this.props.newsFeed.posts.hasNext;
  }

  loadMoreContent() {
    const { dispatch } = this.props;
    const { posts } = this.props.newsFeed;
    dispatch(loadNewsFeed({
      lastPostId: posts.lastPostId
    }));
  }

  render() {
    const { newsFeed, userId, like, isRequestingFollow } = this.props;
    return (
      <NewsFeed
        newsFeed={newsFeed}
        userId={userId}
        like={like}
        isRequestingFollow={isRequestingFollow}
        followUser={this.follow}
        unfollowUser={this.unfollow}
        likePost={this.like}
        unlikePost={this.unlike}
        getLikelist={this.getLikelist}
      >
        {this.props.children}
      </NewsFeed>
    );
  }
}

function mapStateToProps(state) {
  const { newsFeed, like } = state;
  const { userId } = state.user;
  // TODO: Please Fix: it is tricky to use state.person.isFetching to decide is user is requesting follow/unfollow now.
  const isRequestingFollow = state.person.isFetching;
  return {
    newsFeed,
    like,
    userId,
    isRequestingFollow
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(NewsFeedPageContainer, [ loadNewsFeed ])
);
