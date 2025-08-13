import React, { useState, useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import logo from '../../assets/logo.png';
import '../../index.scss';

// --- routes ---
const ROUTES = [
    { title: 'Home', icon: 'fas-solid fa-house', path: '/' },
    { title: 'Sales', icon: 'chart-line', path: '/sales' },
    { title: 'Costs', icon: 'chart-column', path: '/costs' },
    { title: 'Payments', icon: 'wallet', path: '/payments' },
    { title: 'Finances', icon: 'chart-pie', path: '/finances' },
    { title: 'Messages', icon: 'envelope', path: '/messages' },
];

const BOTTOM_ROUTES = [
    { title: 'Settings', icon: 'sliders', path: '/settings' },
    { title: 'Support', icon: 'phone-volume', path: '/support' },
];

// Helper: clamp y position inside viewport with a small margin
const clampY = (y) => {
    const margin = 8;
    const min = margin;
    const max = window.innerHeight - margin;
    return Math.min(Math.max(y, min), max);
};

// Small presentational component for each nav button
const NavButton = ({
                       item,
                       index,
                       isOpened,
                       isLight,
                       showLabels,
                       onNavigate,
                       showTooltipMouse,
                       moveTooltip,
                       hideTooltip,
                       showTooltipFocus,
                       tooltipId,
                       extraClass = '',
                   }) => {
    const labelDelay = `${index * 40}ms`;

    return (
        <button
            key={item.title}
            type="button"
            onClick={() => onNavigate(item.path)}
            aria-label={item.title}
            aria-describedby={!isOpened ? tooltipId : undefined}
            onMouseEnter={(e) => showTooltipMouse(e, item.title)}
            onMouseMove={moveTooltip}
            onMouseLeave={hideTooltip}
            onFocus={(e) => showTooltipFocus(e.currentTarget, item.title)}
            onBlur={hideTooltip}
            className={classnames('sidebar__nav-button', extraClass, {
                'is-closed': !isOpened,
                'is-light': isLight,
            })}
        >
      <span className="sidebar__nav-icon">
        <FontAwesomeIcon icon={item.icon} />
      </span>

            <span
                className={classnames('sidebar__nav-label', {
                    'is-hidden': !isOpened,
                    'is-shown': showLabels,
                })}
                style={{ transitionDelay: showLabels ? labelDelay : '0ms' }}
            >
        {item.title}
      </span>
        </button>
    );
};

NavButton.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    isOpened: PropTypes.bool.isRequired,
    isLight: PropTypes.bool.isRequired,
    showLabels: PropTypes.bool.isRequired,
    onNavigate: PropTypes.func.isRequired,
    showTooltipMouse: PropTypes.func.isRequired,
    moveTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
    showTooltipFocus: PropTypes.func.isRequired,
    tooltipId: PropTypes.string.isRequired,
    extraClass: PropTypes.string,
};

const Sidebar = ({ color = 'dark' }) => {
    // theme + open state
    const [theme, setTheme] = useState(color);
    const [isOpened, setIsOpened] = useState(false);

    // small delay so labels animate only after width expands
    const [showLabels, setShowLabels] = useState(false);
    const labelTimeoutRef = useRef(null);

    // tooltip state (single object keeps related values together)
    const [tooltip, setTooltip] = useState({
        visible: false,
        text: '',
        x: 0,
        y: 0,
    });

    const tooltipIdRef = useRef(`sidebar-tooltip-${Math.random().toString(36).slice(2, 9)}`);
    const sidebarRef = useRef(null);

    // --- effects ---
    useEffect(() => {
        // reveal labels slightly after opening to let width transition finish
        if (isOpened) {
            labelTimeoutRef.current = setTimeout(() => setShowLabels(true), 180);
            // hide any tooltip when opening
            setTooltip((t) => ({ ...t, visible: false }));
        } else {
            clearTimeout(labelTimeoutRef.current);
            setShowLabels(false);
        }

        return () => clearTimeout(labelTimeoutRef.current);
    }, [isOpened]);

    useEffect(() => {
        // hide tooltip on ESC
        const onKey = (e) => e.key === 'Escape' && setTooltip((t) => ({ ...t, visible: false }));
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // --- callbacks / handlers ---
    const toggleSidebar = useCallback(() => setIsOpened((v) => !v), []);
    const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

    // navigation - replace with your router (useNavigate) as needed
    const goToRoute = useCallback((path) => {

        console.log(`going to "${path}"`);
    }, []);

    // tooltip helpers
    const showTooltipMouse = useCallback((e, text) => {
        if (isOpened) return; // don't show when sidebar is open
        const x = e.clientX + 12;
        const y = clampY(e.clientY + 6);
        setTooltip({ visible: true, text, x, y });
    }, [isOpened]);

    const moveTooltip = useCallback((e) => {
        if (!tooltip.visible || isOpened) return;
        setTooltip((t) => ({ ...t, x: e.clientX + 12, y: clampY(e.clientY + 6) }));
    }, [tooltip.visible, isOpened]);

    const hideTooltip = useCallback(() => setTooltip((t) => ({ ...t, visible: false })), []);

    const showTooltipFocus = useCallback((buttonEl, text) => {
        if (isOpened || !buttonEl) return;
        const rect = buttonEl.getBoundingClientRect();
        const sidebarRect = sidebarRef.current?.getBoundingClientRect();
        const left = sidebarRect ? sidebarRect.right + 12 : rect.right + 12;
        const top = clampY(rect.top + rect.height / 2);
        setTooltip({ visible: true, text, x: left, y: top });
    }, [isOpened]);

    const isLight = theme === 'light';

    return (
        <>
            <aside
                ref={sidebarRef}
                aria-expanded={isOpened}
                className={classnames('sidebar', {
                    'sidebar--opened': isOpened,
                    'sidebar--light': isLight,
                })}
            >
                {/* BRAND */}
                <div className="sidebar__brand" role="banner">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-pressed={isLight}
                        aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
                        title={isLight ? 'Dark' : 'Light'}
                        className={classnames('sidebar__theme-toggle', { 'is-light': isLight })}
                    >
                        <FontAwesomeIcon icon={isLight ? 'moon' : 'sun'} />
                    </button>

                    <img className="sidebar__logo" src={logo} alt="TensorFlow logo" />

                    <span
                        className={classnames('sidebar__logo-text', {
                            'is-hidden': !isOpened,
                            'is-shown': showLabels,
                        })}
                        style={{ transitionDelay: showLabels ? '80ms' : '0ms' }}
                    >
            TensorFlow
          </span>

                    <button
                        type="button"
                        aria-label={isOpened ? 'Close sidebar' : 'Open sidebar'}
                        onClick={toggleSidebar}
                        className={classnames('sidebar__toggle', { 'is-light': isLight, 'is-opened': isOpened })}
                    >
                        <FontAwesomeIcon icon={isOpened ? 'angle-left' : 'angle-right'} />
                    </button>
                </div>

                {/* NAV */}
                <nav aria-label="Main navigation" className="sidebar__nav">
                    {ROUTES.map((route, idx) => (
                        <NavButton
                            key={route.title}
                            item={route}
                            index={idx}
                            isOpened={isOpened}
                            isLight={isLight}
                            showLabels={showLabels}
                            onNavigate={goToRoute}
                            showTooltipMouse={showTooltipMouse}
                            moveTooltip={moveTooltip}
                            hideTooltip={hideTooltip}
                            showTooltipFocus={showTooltipFocus}
                            tooltipId={tooltipIdRef.current}
                        />
                    ))}
                </nav>

                {/* FOOTER */}
                <div className="sidebar__footer">
                    {BOTTOM_ROUTES.map((route, idx) => (
                        <NavButton
                            key={route.title}
                            item={route}
                            index={idx}
                            isOpened={isOpened}
                            isLight={isLight}
                            showLabels={showLabels}
                            onNavigate={goToRoute}
                            showTooltipMouse={showTooltipMouse}
                            moveTooltip={moveTooltip}
                            hideTooltip={hideTooltip}
                            showTooltipFocus={showTooltipFocus}
                            tooltipId={tooltipIdRef.current}
                            extraClass="sidebar__footer-button"
                        />
                    ))}
                </div>
            </aside>

            {/* TOOLTIP */}
            <div
                id={tooltipIdRef.current}
                role="status"
                aria-hidden={!tooltip.visible}
                className={classnames('sidebar__tooltip', { 'is-shown': tooltip.visible, 'is-light': isLight })}
                style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: 'translateY(-50%)' }}
            >
                {tooltip.text}
            </div>
        </>
    );
};

Sidebar.propTypes = {
    color: PropTypes.oneOf(['dark', 'light']),
};

export default Sidebar;
