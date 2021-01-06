import React, { useMemo } from 'react';
import PropTypes, { any } from 'prop-types';
import classNames from 'classnames';
import Avatar from '../Avatar';
import BubbleChatImage from './Image';
import Context from './Context';

const propTypes = {
  /**
   * The typing message
   * @default false
   * */
  isTyping: PropTypes.bool,
  /** The text message */
  text: PropTypes.any,
  /** The BubbleChat visual type */
  type: PropTypes.oneOf([
    'inbound',
    'outbound',
    'system',
  ]),
  /** The BubbleChat visual style */
  variant: PropTypes.oneOf([
    'light',
    'primary',
    'primaryLight',
    'dark',
    'transparentDark',
    'transparentLight',
  ]),
  /** The avatar to display. The name can get from Component `Avatar` or custom it by your sefl */
  avatar: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  /** The time of a text message */
  time: PropTypes.any,
  /** The list option using with type `system` */
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  })),
  /** Defines the current active option */
  currentOption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  /** Callback fired when the current active option changes. */
  onSelectOption: PropTypes.func,
  /** Disables the list of options */
  disabledOption: PropTypes.bool,
  /** Callback fired when click to the text content */
  onClickText: PropTypes.func,
  textClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  /** Render actionBar after text content  */
  actionBar: any,
  /**  */
  actionBarClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

const defaultProps = {
  type: 'inbound',
};

const variantTextClassNames = {
  primary: 'u-textWhite',
  dark: 'u-textWhite',
  transparentDark: 'u-textWhite',
};

const variantClassNames = {
  primary: 'u-backgroundPrimary',
  primaryLight: 'u-backgroundPrimaryLight',
  light: 'u-backgroundLightest',
  dark: 'u-backgroundSemiDark',
  transparentDark: 'u-backgroundTransparent',
  transparentLight: 'u-backgroundTransparent',
};

const typeThemeClassNames = {
  inbound: 'u-roundedBottomRightNone',
  outbound: 'u-roundedBottomLeftNone',
  system: 'u-backgroundPrimaryLight',
};

const typeRadiusClassNames = {
  inbound: 'u-roundedExtraLarge u-roundedBottomRightNone',
  outbound: 'u-roundedExtraLarge  u-roundedBottomLeftNone',
  system: 'u-roundedExtraLarge',
};

const BubbleChat = React.forwardRef(({ className, isTyping, text, type, variant, time, avatar, options, currentOption, onSelectOption, disabledOption, children, onClickText, actionBar, actionBarClassName, textClassName, ...props }, ref) => {
  let variantOri = variant;
  if (variant === undefined) {
    if (type === 'inbound') variantOri = 'primary';
    else if (type === 'outbound') variantOri = 'light';
  }
  const context = useMemo(() => ({ type }), [type]);
  console.log({ variantOri });
  return (
    <Context.Provider value={context}>
      <div
        ref={ref}
        {...props}
        className={classNames(
          'BubbleChat',
          'u-marginBottomSmall',
          (type !== 'inbound') ? 'u-marginRightExtraLarge' : 'u-marginLeftExtraLarge',
          className && className
        )}
      >
        <div className={classNames(
          'BubbleChat-container',
          'u-flex',
          (type === 'inbound') && 'u-justifyContentEnd u-marginLeftAuto',
        )}
        >
          {(avatar && type !== 'inbound') && (
            <div className="u-flexShrink0 u-marginRightExtraSmall u-marginTopExtraSmall">
              {
                typeof (avatar) === 'function' ? avatar() : <Avatar name={avatar} size="small" />
              }
            </div>
          )}

          <div className={classNames(
            'BubbleChat-context',
            'u-flex u-flexColumn',
            children && 'u-widthFull',
            (type === 'inbound' && !avatar) && 'u-marginLeftMedium',
            (type === 'inbound' && !children) && 'u-alignItemsEnd'
          )}
          >
            <React.Fragment>
              {isTyping && (
              <div className={classNames(
                'u-overflowHidden',
                type && typeRadiusClassNames[type]
              )}
              >
                <div
                  className={classNames(
                    'BubbleChat-typing',
                    'u-paddingExtraSmall u-positionRelative',
                    type && typeThemeClassNames[type],
                    variantOri && variantClassNames[variantOri],
                  )}
                >
                  <div className="BubbleChat-typingContext u-positionRelative u-fontSizeNone" style={{ width: 32, height: 10 }} />
                </div>
              </div>
              )}
              {!isTyping && (
              <React.Fragment>
                {children || (
                <div className="u-positionRelative">
                  {actionBar && (
                    <div className={classNames(
                      'u-positionAbsolute u-positionTop u-marginTopTiny u-marginHorizontalExtraSmall',
                      type === 'inbound' ? 'u-positionRight-100' : 'u-positionLeft-100',
                      actionBarClassName && actionBarClassName,
                    )}
                    >
                      {actionBar}
                    </div>
                  )}
                  <div className={classNames(
                    'u-overflowHidden',
                    type && typeRadiusClassNames[type]
                  )}
                  >
                    <div
                      className={classNames(
                        'BubbleChat-text',
                        'u-paddingVerticalExtraSmall u-paddingHorizontalSmall u-textPreLine',
                        type && typeThemeClassNames[type],
                        ((variantOri === 'primary' || variantOri === 'dark' || variantOri === 'transparentDark') && textClassName) ? textClassName : variantTextClassNames[variantOri],
                        variantOri && variantClassNames[variantOri],

                      )}
                      onClick={onClickText}
                    >
                      {text}
                    </div>
                    {options && (
                    <div className={classNames(
                      'u-flex u-flexColumn u-border u-borderUltraLight u-roundedBottomExtraLarge u-text200 u-overflowHidden',
                      disabledOption ? 'u-backgroundLighter u-textGray' : 'u-backgroundWhite u-textPrimary',
                    )}
                    >
                      {options.map((option, idx) => (
                        <div
                          key={option.id}
                          onClick={disabledOption || option.id === currentOption ? null : () => onSelectOption(option.id)}
                          className={classNames(
                            'u-paddingExtraSmall u-textCenter',
                            `Op-${variantOri}`,
                            (idx !== 0) && 'u-borderTop u-borderUltraLight',
                            disabledOption ? 'u-cursorNotAllow' : 'u-cursorPointer',
                            (!disabledOption && option.id !== currentOption) && 'hover:u-backgroundLightest',
                            (option.id === currentOption) && 'u-backgroundPrimary',
                            (option.id === currentOption && !textClassName) && 'u-textWhite',
                            (option.id === currentOption && textClassName) && textClassName
                          )}
                        >
                          {option.name}
                        </div>
                      ))}
                    </div>
                    )}
                  </div>
                </div>
                )}
                {time && (
                <div className={classNames(
                  'BubbleChat-time',
                  'u-text100 u-textLight u-marginTopTiny',
                  (type === 'inbound' && children) && 'u-textRight'
                )}
                >
                  {time}
                </div>
                )}
              </React.Fragment>
              )}
            </React.Fragment>
          </div>
          {(avatar && (type !== 'outbound' && type !== 'system')) && (
            <div className="u-flexShrink0 u-marginLeftExtraSmall u-marginTopExtraSmall">
              {
              typeof (avatar) === 'function' ? avatar() : <Avatar name={avatar} size="small" />
            }
            </div>
          )}
        </div>
      </div>
    </Context.Provider>
  );
});

BubbleChat.Image = BubbleChatImage;
BubbleChat.displayName = 'BubbleChat';
BubbleChat.defaultProps = defaultProps;
BubbleChat.propTypes = propTypes;
export default BubbleChat;
