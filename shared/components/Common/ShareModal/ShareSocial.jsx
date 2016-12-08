'use strict';

import React, { Component, PropTypes } from 'react';
import isEmpty from 'is-empty';
import FacebookLogin from 'react-facebook-login';
import Select from 'components/Common/Select';

import {
  getFacebookManagedPages,
  getFacebookGroups
} from './FacebookUtils';
import {
  DEFAULT_TITLE,
  FACEBOOK_PRIVACY
} from 'constants/common';
import FlatButton from 'components/Common/FlatButton';
import externalApiConfig from 'etc/external-api'

if (process.env.BROWSER) {
  require('./ShareSocial.css');
}

const SHARE_TARGET = {
  NONE: 'NONE',
  FACEBOOK: 'FACEBOOK'
};

const FACEBOOK_TARGET = {
  OWN: 'OWN',
  GROUP: 'GROUP',
  PAGE: 'PAGE'
};

const propTypes = {
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  shareUrl: PropTypes.string.isRequired,
  shareFacebookVideo: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

const defaultProps = {
};

class ShareSocial extends Component {
  static contextTypes = { i18n: PropTypes.object };

  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      fbUserId: '',
      fbUserAccessToken: '',
      fbManagedPages: [],
      fbSelectedPageIdx: -1,
      fbManagedGroups: [],
      fbSelectedGroupIdx: -1,
      fbPrivacy: FACEBOOK_PRIVACY.EVERYONE,
      fbTarget: FACEBOOK_TARGET.OWN,
      shareTarget: SHARE_TARGET.NONE
    };

    // Bind "this" to member functions
    this.handleClickFacebookLoginBtn = this.handleClickFacebookLoginBtn.bind(this);
    this.handleClickShareToFacebookBtn = this.handleClickShareToFacebookBtn.bind(this);
    this.handleChangeFacebookTargetOptions = this.handleChangeFacebookTargetOptions.bind(this);
    this.handleChangeFacebookSelectedGroup = this.handleChangeFacebookSelectedGroup.bind(this);
    this.handleChangeFacebookSelectedPage = this.handleChangeFacebookSelectedPage.bind(this);
    this.handleChangeFacebookPrivacyOptions = this.handleChangeFacebookPrivacyOptions.bind(this);
  }

  // Handler for clicking facebook sharing button
  handleClickFacebookLoginBtn(res) {
    const {
      id,
      accessToken
    } = res;

    if (id && accessToken) {
      getFacebookManagedPages(id).then((pages) => {
        this.setState({
          fbManagedPages: pages,
          fbSelectedPageIdx: pages.length > 0 ? 0 : -1
        });
        return getFacebookGroups(id);
      }).then((groups) => {
        this.setState({
          fbUserId: id,
          fbUserAccessToken: accessToken,
          fbManagedGroups: groups,
          fbSelectedGroupIdx: groups.length > 0 ? 0 : -1,
          shareTarget: SHARE_TARGET.FACEBOOK
        });
      }).catch(() => {
        // TODO: Error handling
      })
    }
  }

  // Handler for clicking button to share video to Facebook
  handleClickShareToFacebookBtn() {
    const { l } = this.context.i18n;
    const {
      mediaId,
      title,
      shareUrl,
      shareFacebookVideo,
      close
    } = this.props;
    const {
      fbUserId,
      fbUserAccessToken,
      fbManagedGroups,
      fbSelectedGroupIdx,
      fbManagedPages,
      fbSelectedPageIdx,
      fbPrivacy,
      fbTarget
    } = this.state;
    const userDesc = this.refs.shareFBVideoDesc.value;
    const isEmptyUserDesc = isEmpty(userDesc);
    const signature = `${l('Create your imigination on Verpix')}:\n ${shareUrl}\n#Verpix #MotionGraph`;
    const description = `${userDesc}${isEmptyUserDesc ? '' : '\n\n--\n'}${signature}`;
    let targetId;
    let fbAccessToken;

    if (fbTarget === FACEBOOK_TARGET.OWN) {
      targetId = fbUserId;
      fbAccessToken = fbUserAccessToken
    } else if (fbTarget === FACEBOOK_TARGET.GROUP) {
      targetId = fbManagedGroups[fbSelectedGroupIdx].id;
      fbAccessToken = fbUserAccessToken
    } else if (fbTarget === FACEBOOK_TARGET.PAGE) {
      targetId = fbManagedPages[fbSelectedPageIdx].id;
      fbAccessToken = fbManagedPages[fbSelectedPageIdx].access_token;
    } else {
      // TODO: Error handling
    }

    shareFacebookVideo({
      mediaId,
      targetId,
      title: title ? title : l(DEFAULT_TITLE),
      description,
      privacy: fbPrivacy,
      fbAccessToken
    });
    close();
  }

  // Handler for changing facebook target options
  handleChangeFacebookTargetOptions(option) {
    this.setState({
      fbTarget: option.value
    })
  }

  // Handler for changing facebook selected group index
  handleChangeFacebookSelectedGroup(option) {
    this.setState({
      fbSelectedGroupIdx: option.value
    })
  }

  // Handler for changing facebook selected page index
  handleChangeFacebookSelectedPage(option) {
    this.setState({
      fbSelectedPageIdx: option.value
    })
  }

  // Handler for changing facebook privacy options
  handleChangeFacebookPrivacyOptions(option) {
    this.setState({
      fbPrivacy: option.value
    })
  }

  // Render preview for Facebook sharing
  renderFacebookSharePreview(target, groups, selectedGroupIdx, pages, selectedPageIdx, privacy) {
    const { l } = this.context.i18n;
    const privacyOptions = [{
      icon: 'globe',
      value: FACEBOOK_PRIVACY.EVERYONE,
      label: l('Public')
    }, {
      icon: 'user',
      value: FACEBOOK_PRIVACY.ALL_FRIENDS,
      label: l('Friends')
    }, {
      icon: 'lock',
      value: FACEBOOK_PRIVACY.SELF,
      label: l('Only Me')
    }];
    const targetOptions = [{
      icon: 'pencil-square-o',
      value: FACEBOOK_TARGET.OWN,
      label: l('Share on your own Timeline')
    }];
    let groupsSelect;
    let pagesSelect;

    if (groups.length > 0) {
      targetOptions.push({
        icon: 'users',
        value: FACEBOOK_TARGET.GROUP,
        label: l('Share in a group you manage')
      });

      if (target === FACEBOOK_TARGET.GROUP) {
        const groupOptions = groups.map((group, idx) => ({
          value: idx,
          label: group.name,
          img: group.imgUrl
        }));
        groupsSelect =
          <Select
            name="facebook-group"
            value={selectedGroupIdx}
            options={groupOptions}
            searchable={false}
            clearable={false}
            onChange={this.handleChangeFacebookSelectedGroup}
          />
      }
    }

    if (pages.length > 0 ) {
      targetOptions.push({
        icon: 'flag',
        value: FACEBOOK_TARGET.PAGE,
        label: l('Share on a Page you manage')
      });

      if (target === FACEBOOK_TARGET.PAGE) {
        const pageOptions = pages.map((page, idx) => ({
          value: idx,
          label: page.name,
          img: page.imgUrl
        }));
        pagesSelect =
          <Select
            name="facebook-page"
            value={selectedPageIdx}
            options={pageOptions}
            searchable={false}
            clearable={false}
            onChange={this.handleChangeFacebookSelectedPage}
          />
      }
    }

    return (
      <div className="facebook-share-preview container-center-row">
        <h5 className="text-center">{`${l('Share to')} Facebook`}</h5>
        <div className="facebook-target-wrapper margin-bottom-15">
          <Select
            name="facebook-target"
            className="facebook-target-select"
            value={target}
            options={targetOptions}
            searchable={false}
            clearable={false}
            onChange={this.handleChangeFacebookTargetOptions}
          />
          {groupsSelect}
          {pagesSelect}
        </div>
        <textarea
          ref="shareFBVideoDesc"
          className="form-control"
          rows="4"
          placeholder={`${l('Say something')}...`}
        />
        <div className="margin-bottom-15" />
        <div className="facebook-settings">
          {
            (target === FACEBOOK_TARGET.OWN) &&
            <Select
              name="facebook-privacy"
              value={privacy}
              options={privacyOptions}
              searchable={false}
              clearable={false}
              onChange={this.handleChangeFacebookPrivacyOptions}
            />
          }
          <FlatButton
            text={l('Post')}
            className="share-btn margin-left-10"
            onClick={this.handleClickShareToFacebookBtn}
          />
        </div>
      </div>
    );
  }

  render() {
    const { l } = this.context.i18n;
    const fbLoginBtnClass = 'flat-button-component share-btn';
    const {
      fbManagedGroups,
      fbSelectedGroupIdx,
      fbManagedPages,
      fbSelectedPageIdx,
      fbPrivacy,
      fbTarget,
      shareTarget
    } = this.state;
    const fbSharePreview =
      shareTarget === SHARE_TARGET.FACEBOOK ?
      this.renderFacebookSharePreview(fbTarget, fbManagedGroups, fbSelectedGroupIdx, fbManagedPages, fbSelectedPageIdx, fbPrivacy) :
      null;

    return (
      <div className="share-social-component">
        {
          (shareTarget === SHARE_TARGET.NONE) &&
          <div>
            <h5 className="text-center">{l('Share to')}</h5>
            <div className="container-center-col">
              <FacebookLogin
                appId={externalApiConfig.facebook.id}
                version={externalApiConfig.facebook.version}
                scope="publish_actions,user_managed_groups,pages_show_list,manage_pages,publish_pages"
                callback={this.handleClickFacebookLoginBtn}
                cssClass={fbLoginBtnClass}
                textButton="Facebook"
              />
            </div>
          </div>
        }
        {fbSharePreview}
      </div>
    );
  }
}

ShareSocial.propTypes = propTypes;
ShareSocial.defaultProps = defaultProps;

export default ShareSocial;
