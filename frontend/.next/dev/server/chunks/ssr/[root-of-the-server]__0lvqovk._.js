module.exports = [
"[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Button.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ as: Component = 'button', variant = 'primary', size = 'md', type = 'button', className = '', children, ...props }, ref)=>{
    const classes = [
        'btn',
        variant ? `btn-${variant}` : '',
        size !== 'md' ? `btn-${size}` : '',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        ref: ref,
        className: classes,
        type: Component === 'button' ? type : undefined,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Button.jsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = 'Button';
const __TURBOPACK__default__export__ = Button;
}),
"[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Card.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const Card = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className = '', hover = false, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: [
            'card',
            hover && 'card-hover',
            className
        ].filter(Boolean).join(' '),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Card.jsx",
        lineNumber: 4,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Card.displayName = 'Card';
const CardHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className = '', ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: [
            'card-header',
            className
        ].filter(Boolean).join(' '),
        ...props
    }, void 0, false, {
        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Card.jsx",
        lineNumber: 11,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardHeader.displayName = 'CardHeader';
const CardTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className = '', ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: [
            'card-title',
            className
        ].filter(Boolean).join(' '),
        ...props
    }, void 0, false, {
        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Card.jsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardTitle.displayName = 'CardTitle';
const CardDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className = '', ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: [
            'card-description',
            className
        ].filter(Boolean).join(' '),
        ...props
    }, void 0, false, {
        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Card.jsx",
        lineNumber: 21,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardDescription.displayName = 'CardDescription';
const CardContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className = '', ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: [
            'card-content',
            className
        ].filter(Boolean).join(' '),
        ...props
    }, void 0, false, {
        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Card.jsx",
        lineNumber: 26,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardContent.displayName = 'CardContent';
const CardFooter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className = '', ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: [
            'card-footer',
            className
        ].filter(Boolean).join(' '),
        ...props
    }, void 0, false, {
        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Card.jsx",
        lineNumber: 31,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardFooter.displayName = 'CardFooter';
;
const __TURBOPACK__default__export__ = Card;
}),
"[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Input.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const Input = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ label, id, error, className = '', wrapperClassName = '', ...props }, ref)=>{
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `form-group ${wrapperClassName}`.trim(),
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: inputId,
                className: "form-label",
                children: label
            }, void 0, false, {
                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Input.jsx",
                lineNumber: 16,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: ref,
                id: inputId,
                className: `form-input ${error ? 'border-red-500' : ''} ${className}`.trim(),
                ...props
            }, void 0, false, {
                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Input.jsx",
                lineNumber: 20,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-500 text-sm mt-1",
                children: error
            }, void 0, false, {
                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Input.jsx",
                lineNumber: 27,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Input.jsx",
        lineNumber: 14,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
Input.displayName = 'Input';
const __TURBOPACK__default__export__ = Input;
}),
"[project]/Developer/Web_dev/UniSync/frontend/src/services/dbService.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCommunity",
    ()=>createCommunity,
    "createEvent",
    ()=>createEvent,
    "createJob",
    ()=>createJob,
    "createMentorship",
    ()=>createMentorship,
    "createReply",
    ()=>createReply,
    "createThread",
    ()=>createThread,
    "getChatMessages",
    ()=>getChatMessages,
    "getChatRooms",
    ()=>getChatRooms,
    "getCommunities",
    ()=>getCommunities,
    "getConnections",
    ()=>getConnections,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getEvents",
    ()=>getEvents,
    "getJobs",
    ()=>getJobs,
    "getMentorships",
    ()=>getMentorships,
    "getPotentialMentors",
    ()=>getPotentialMentors,
    "getReplies",
    ()=>getReplies,
    "getThreads",
    ()=>getThreads,
    "sendConnectionRequest",
    ()=>sendConnectionRequest,
    "updateConnectionStatus",
    ()=>updateConnectionStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/src/services/api.js [app-ssr] (ecmascript)");
;
async function getCurrentUser() {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/auth/me', {
        auth: true
    });
    return response.data ?? null;
}
async function createEvent(event) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/events', {
        method: 'POST',
        body: event,
        auth: true
    });
    return response.data;
}
async function getEvents() {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/events');
    return response.data ?? [];
}
async function createMentorship(mentorship) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/mentorships', {
        method: 'POST',
        body: mentorship,
        auth: true
    });
    return response.data;
}
async function getMentorships() {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/mentorships', {
        auth: true
    });
    return response.data ?? [];
}
async function getPotentialMentors(interest) {
    const params = interest ? `?interest=${encodeURIComponent(interest)}` : '';
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/api/mentorships/mentors${params}`, {
        auth: true
    });
    return response.data ?? [];
}
async function createJob(job) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/jobs', {
        method: 'POST',
        body: job,
        auth: true
    });
    return response.data;
}
async function getJobs() {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/jobs');
    return response.data ?? [];
}
async function createCommunity(community) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/communities', {
        method: 'POST',
        body: community,
        auth: true
    });
    return response.data;
}
async function getCommunities() {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/communities');
    return response.data ?? [];
}
async function getThreads(communityId) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/api/communities/${communityId}/threads`);
    return response.data ?? [];
}
async function createThread(communityId, thread) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/api/communities/${communityId}/threads`, {
        method: 'POST',
        body: thread,
        auth: true
    });
    return response.data;
}
async function getReplies(threadId) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/api/threads/${threadId}/replies`);
    return response.data ?? [];
}
async function createReply(threadId, reply) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/api/threads/${threadId}/replies`, {
        method: 'POST',
        body: reply,
        auth: true
    });
    return response.data;
}
async function sendConnectionRequest(receiverId) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/connections', {
        method: 'POST',
        body: {
            receiverId
        },
        auth: true
    });
    return response.data;
}
async function getConnections() {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/connections', {
        auth: true
    });
    return response.data ?? [];
}
async function updateConnectionStatus(connectionId, status) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        body: {
            status
        },
        auth: true
    });
    return response.data;
}
async function getChatRooms() {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])('/api/chat/rooms', {
        auth: true
    });
    return response.data ?? [];
}
async function getChatMessages(roomId) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiRequest"])(`/api/chat/rooms/${roomId}/messages`, {
        auth: true
    });
    return response.data ?? [];
}
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/Developer/Web_dev/UniSync/frontend/src/hooks/useChatSocket.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useChatSocket",
    ()=>useChatSocket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/socket.io-client/build/esm-debug/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/src/services/api.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function useChatSocket(roomId, onMessageReceived) {
    const [socket, setSocket] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [onlineUsers, setOnlineUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [typingUsers, setTypingUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const onMessageReceivedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(onMessageReceived);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        onMessageReceivedRef.current = onMessageReceived;
    }, [
        onMessageReceived
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const token = localStorage.getItem('token');
        if (!token) return;
        const newSocket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiUrl"])(''), {
            auth: {
                token
            }
        });
        newSocket.on('connect', ()=>{
            setIsConnected(true);
            if (roomId) {
                newSocket.emit('room:join', roomId);
            }
        });
        newSocket.on('disconnect', ()=>{
            setIsConnected(false);
        });
        newSocket.on('chat:message', (msg)=>{
            onMessageReceivedRef.current?.(msg);
        });
        newSocket.on('presence:update', (users)=>{
            setOnlineUsers(users);
        });
        newSocket.on('typing:update', ({ userId, typing })=>{
            setTypingUsers((prev)=>({
                    ...prev,
                    [userId]: typing
                }));
        });
        setSocket(newSocket);
        return ()=>{
            newSocket.disconnect();
        };
    }, []);
    // Re-join when roomId changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (socket && isConnected && roomId) {
            socket.emit('room:join', roomId);
        }
    }, [
        roomId,
        socket,
        isConnected
    ]);
    const sendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((content)=>{
        if (socket && isConnected && roomId) {
            socket.emit('chat:send', {
                roomId,
                content
            });
        }
    }, [
        socket,
        isConnected,
        roomId
    ]);
    const setTyping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((isTyping)=>{
        if (socket && isConnected && roomId) {
            socket.emit(isTyping ? 'typing:start' : 'typing:stop', roomId);
        }
    }, [
        socket,
        isConnected,
        roomId
    ]);
    return {
        isConnected,
        sendMessage,
        setTyping,
        onlineUsers,
        typingUsers
    };
}
}),
"[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/lucide-react/dist/esm/icons/send.mjs [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Avatar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Avatar.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Button.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Card.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Input$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/src/components/common/Input.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$dbService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/src/services/dbService.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$hooks$2f$useChatSocket$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/src/hooks/useChatSocket.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
function Chat() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const requestedRoomId = searchParams.get('room');
    const requestedUserId = searchParams.get('user');
    const requestedUserName = searchParams.get('name');
    const [chatRooms, setChatRooms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeConversation, setActiveConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loadingRooms, setLoadingRooms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const messagesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const activeConversationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(activeConversation);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        activeConversationRef.current = activeConversation;
    }, [
        activeConversation
    ]);
    const { isConnected, sendMessage, setTyping } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$hooks$2f$useChatSocket$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useChatSocket"])(activeConversation?.id, (msg)=>{
        // Ensure the message belongs to the current room
        const currentConv = activeConversationRef.current;
        if (currentConv && Number(msg.roomId) === Number(currentConv.id)) {
            setMessages((prev)=>[
                    ...prev,
                    msg
                ]);
        }
    });
    const currentUserId = Number(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 0);
    // Load Rooms
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let ignore = false;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$dbService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getChatRooms"])().then((rooms)=>{
            if (ignore) return;
            let finalRooms = [
                ...rooms
            ];
            let selectedRoom = null;
            if (requestedRoomId) {
                selectedRoom = finalRooms.find((r)=>Number(r.id) === Number(requestedRoomId));
            }
            if (!selectedRoom && requestedUserId && requestedUserName) {
                // Pseudo room for an upcoming chat
                selectedRoom = {
                    id: `new-${requestedUserId}`,
                    isGroup: false,
                    name: requestedUserName,
                    isPseudo: true,
                    participants: [
                        {
                            id: requestedUserId,
                            name: requestedUserName
                        }
                    ]
                };
                finalRooms = [
                    selectedRoom,
                    ...finalRooms
                ];
            }
            setChatRooms(finalRooms);
            setActiveConversation(selectedRoom || finalRooms[0] || null);
            setLoadingRooms(false);
        });
        return ()=>{
            ignore = true;
        };
    }, [
        requestedRoomId,
        requestedUserId,
        requestedUserName
    ]);
    // Load Messages when Active Conversation changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (activeConversation && !activeConversation.isPseudo) {
            let ignore = false;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$services$2f$dbService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getChatMessages"])(activeConversation.id).then((msgs)=>{
                if (!ignore) setMessages(msgs);
            });
            return ()=>{
                ignore = true;
            };
        } else {
            setMessages([]);
        }
    }, [
        activeConversation
    ]);
    // Auto-scroll messages
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (messagesRef.current) {
            messagesRef.current.scrollTo({
                top: messagesRef.current.scrollHeight
            });
        }
    }, [
        messages
    ]);
    const handleSendMessage = ()=>{
        const text = draft.trim();
        if (!text) return;
        if (activeConversation?.isPseudo) {
            alert("Please ensure the connection is fully accepted before chatting.");
            return;
        }
        sendMessage(text);
        setDraft('');
        setTyping(false);
    };
    const getRoomDisplayName = (room)=>{
        if (room.isGroup) return room.name || 'Group Chat';
        // For DMs, find the other participant
        const other = room.participants?.find((p)=>Number(p.id) !== currentUserId);
        return other ? other.name : 'Unknown User';
    };
    const getRoomDisplayTone = (room)=>{
        return room.isGroup ? 'purple' : 'blue';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "us-chat-layout",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        style: {
                            paddingBottom: '1rem'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                            style: {
                                fontSize: '1.25rem'
                            },
                            children: "Messages"
                        }, void 0, false, {
                            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        style: {
                            flex: 1,
                            overflowY: 'auto',
                            padding: '0 1rem 1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem'
                        },
                        children: [
                            loadingRooms ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Loading chats..."
                            }, void 0, false, {
                                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                lineNumber: 130,
                                columnNumber: 27
                            }, this) : chatRooms.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "No conversations yet."
                            }, void 0, false, {
                                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                lineNumber: 130,
                                columnNumber: 78
                            }, this) : null,
                            chatRooms.map((room)=>{
                                const isActive = activeConversation?.id === room.id;
                                const displayName = getRoomDisplayName(room);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveConversation(room),
                                    type: "button",
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.75rem',
                                        width: '100%',
                                        background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                                        border: 'none',
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'background 0.2s'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Avatar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            name: displayName,
                                            tone: getRoomDisplayTone(room)
                                        }, void 0, false, {
                                            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                flex: 1,
                                                minWidth: 0,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    fontSize: '0.95rem',
                                                    color: 'var(--color-text-heading)',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                },
                                                children: displayName
                                            }, void 0, false, {
                                                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                                lineNumber: 146,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, room.id, true, {
                                    fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                    lineNumber: 135,
                                    columnNumber: 15
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                    width: '100%'
                },
                children: activeConversation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: '1rem 1.5rem',
                                borderBottom: '1px solid var(--color-border)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    flex: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Avatar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        name: getRoomDisplayName(activeConversation),
                                        tone: getRoomDisplayTone(activeConversation)
                                    }, void 0, false, {
                                        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                        lineNumber: 161,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                style: {
                                                    fontSize: '1rem',
                                                    margin: 0
                                                },
                                                children: getRoomDisplayName(activeConversation)
                                            }, void 0, false, {
                                                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                                lineNumber: 163,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: '0.875rem',
                                                    color: 'var(--color-text-muted)'
                                                },
                                                children: isConnected ? 'Connected' : 'Connecting...'
                                            }, void 0, false, {
                                                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                                lineNumber: 164,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                        lineNumber: 162,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                lineNumber: 160,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                            lineNumber: 159,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            ref: messagesRef,
                            style: {
                                flex: 1,
                                overflowY: 'auto',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                background: 'var(--color-page-bg)'
                            },
                            children: [
                                messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        textAlign: 'center',
                                        color: 'var(--color-text-muted)'
                                    },
                                    children: "No messages yet."
                                }, void 0, false, {
                                    fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                    lineNumber: 173,
                                    columnNumber: 41
                                }, this),
                                messages.map((message)=>{
                                    const isMe = Number(message.senderId) === currentUserId;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexDirection: isMe ? 'row-reverse' : 'row',
                                            gap: '1rem',
                                            alignItems: 'flex-end'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Avatar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                name: message.sender?.name || 'User',
                                                tone: isMe ? 'purple' : 'blue',
                                                size: "sm"
                                            }, void 0, false, {
                                                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                                lineNumber: 178,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    maxWidth: '70%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: isMe ? 'flex-end' : 'flex-start'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            padding: '0.75rem 1rem',
                                                            borderRadius: '1rem',
                                                            background: isMe ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                                                            color: isMe ? 'white' : 'var(--color-text)',
                                                            boxShadow: 'var(--shadow-xs)',
                                                            border: isMe ? 'none' : '1px solid var(--color-border)',
                                                            borderBottomRightRadius: isMe ? 0 : '1rem',
                                                            borderBottomLeftRadius: isMe ? '1rem' : 0
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                margin: 0,
                                                                fontSize: '0.95rem',
                                                                lineHeight: 1.5
                                                            },
                                                            children: message.content
                                                        }, void 0, false, {
                                                            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                                            lineNumber: 181,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                                        lineNumber: 180,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '0.7rem',
                                                            color: 'var(--color-text-soft)',
                                                            marginTop: '0.25rem'
                                                        },
                                                        children: new Date(message.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                                        lineNumber: 183,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                                lineNumber: 179,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, message.id, true, {
                                        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                        lineNumber: 177,
                                        columnNumber: 19
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                            lineNumber: 172,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "us-chat-input-bar",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Input$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    value: draft,
                                    onChange: (event)=>{
                                        setDraft(event.target.value);
                                        setTyping(event.target.value.length > 0);
                                    },
                                    onKeyDown: (event)=>{
                                        if (event.key === 'Enter' && !event.shiftKey) {
                                            event.preventDefault();
                                            handleSendMessage();
                                        }
                                    },
                                    placeholder: "Type a message...",
                                    style: {
                                        flex: 1
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                    lineNumber: 194,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$components$2f$common$2f$Button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    onClick: handleSendMessage,
                                    variant: "primary",
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                            lineNumber: 210,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                display: 'none'
                                            },
                                            children: "Send"
                                        }, void 0, false, {
                                            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                            lineNumber: 210,
                                            columnNumber: 36
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                                    lineNumber: 209,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                            lineNumber: 193,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-muted)'
                    },
                    children: "Select a conversation to start chatting"
                }, void 0, false, {
                    fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                    lineNumber: 215,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
                lineNumber: 155,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx",
        lineNumber: 123,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = Chat;
}),
"[project]/Developer/Web_dev/UniSync/frontend/src/app/(dashboard)/chat/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$views$2f$Chat$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Developer/Web_dev/UniSync/frontend/src/views/Chat.jsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading chat..."
        }, void 0, false, {
            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/app/(dashboard)/chat/page.jsx",
            lineNumber: 8,
            columnNumber: 25
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Developer$2f$Web_dev$2f$UniSync$2f$frontend$2f$src$2f$views$2f$Chat$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/app/(dashboard)/chat/page.jsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Developer/Web_dev/UniSync/frontend/src/app/(dashboard)/chat/page.jsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0lvqovk._.js.map