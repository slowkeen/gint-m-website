// 存储每个标签页的插件状态
const tabStates = new Map();

// 更新图标状态
function updateIcon(tabId, isActive) {
	const iconPath = isActive ? 'icon.png' : 'icon-inactive.png';
	chrome.action.setIcon({
		tabId: tabId,
		path: iconPath
	});
}

async function runApp() {
	async function getCurrentTab() {
		return new Promise(resolve => {
			chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
				resolve(tabs[0])
			});
		})
	}

	const tab = await getCurrentTab();
	
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		files: ['content.js']
	})
}

chrome.action.onClicked.addListener(runApp);

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender) => {
	if (request.type === "reload") {
		chrome.runtime.reload()
	}
	
	// 处理插件状态变化消息
	if (request.type === "rulerStateChanged") {
		const tabId = sender.tab?.id;
		if (tabId) {
			tabStates.set(tabId, request.isActive);
			updateIcon(tabId, request.isActive);
		}
	}
});

// 当标签页关闭时清理状态
chrome.tabs.onRemoved.addListener((tabId) => {
	tabStates.delete(tabId);
});

// 当标签页更新（刷新）时重置图标为非活跃状态
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
	if (changeInfo.status === 'loading') {
		tabStates.delete(tabId);
		updateIcon(tabId, false);
	}
});

// 当标签页切换时，根据保存的状态恢复图标
chrome.tabs.onActivated.addListener(async (activeInfo) => {
	const tabId = activeInfo.tabId;
	const isActive = tabStates.get(tabId) || false;
	updateIcon(tabId, isActive);
});