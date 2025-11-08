
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Project, LogEntry, EditorType, LayoutType } from './types';
import { DEFAULT_PROJECT } from './constants';
import { useDebounce } from './hooks/useDebounce';
import Toolbar from './components/Toolbar';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import ProjectsModal from './components/modals/ProjectsModal';
import HelpModal from './components/modals/HelpModal';
import ExternalResourcesModal from './components/modals/ExternalResourcesModal';

declare const JSZip: any;
declare const html2canvas: any;

const App: React.FC = () => {
    const [htmlCode, setHtmlCode] = useState<string>(DEFAULT_PROJECT.html);
    const [cssCode, setCssCode] = useState<string>(DEFAULT_PROJECT.css);
    const [jsCode, setJsCode] = useState<string>(DEFAULT_PROJECT.js);
    const [externalResources, setExternalResources] = useState<string[]>(DEFAULT_PROJECT.externalResources);

    const [srcDoc, setSrcDoc] = useState('');
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProject] = useState<Project | null>(null);

    const [layout, setLayout] = useState<LayoutType>('horizontal');
    const [editorWidth, setEditorWidth] = useState(50);
    const isResizing = useRef(false);

    const [isProjectsModalOpen, setProjectsModalOpen] = useState(false);
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);
    const [isResourcesModalOpen, setResourcesModalOpen] = useState(false);
    
    const debouncedHtml = useDebounce(htmlCode, 500);
    const debouncedCss = useDebounce(cssCode, 500);
    const debouncedJs = useDebounce(jsCode, 500);
    const debouncedResources = useDebounce(externalResources, 500);

    const previewIframeRef = useRef<HTMLIFrameElement>(null);

    const generateSrcDoc = useCallback(() => {
        const resourceLinks = debouncedResources
            .map(url => {
                if (url.endsWith('.css')) {
                    return `<link rel="stylesheet" href="${url}">`;
                }
                if (url.endsWith('.js')) {
                    return `<script src="${url}" defer></script>`;
                }
                return '';
            })
            .join('\n');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${debouncedCss}</style>
                ${resourceLinks}
            </head>
            <body>
                ${debouncedHtml}
                <script>
                    (function() {
                        const post = (type, args) => {
                            try {
                                window.parent.postMessage({
                                    source: 'iframe-console',
                                    type: type,
                                    message: args.map(arg => {
                                      if (arg instanceof Error) {
                                        return { message: arg.message, stack: arg.stack };
                                      }
                                      return arg;
                                    })
                                }, '*');
                            } catch (e) {
                                window.parent.postMessage({
                                    source: 'iframe-console',
                                    type: 'error',
                                    message: ['Could not serialize log message.']
                                }, '*');
                            }
                        };
                        
                        const originalLog = console.log;
                        console.log = (...args) => { post('log', args); originalLog.apply(console, args); };
                        const originalError = console.error;
                        console.error = (...args) => { post('error', args); originalError.apply(console, args); };
                        const originalWarn = console.warn;
                        console.warn = (...args) => { post('warn', args); originalWarn.apply(console, args); };

                        window.onerror = (message, source, lineno, colno, error) => {
                            post('error', [error || message]);
                            return true;
                        };
                    })();
                </script>
                <script>${debouncedJs}</script>
            </body>
            </html>
        `;
    }, [debouncedHtml, debouncedCss, debouncedJs, debouncedResources]);

    useEffect(() => {
        setSrcDoc(generateSrcDoc());
    }, [generateSrcDoc]);

    const handleMessage = useCallback((event: MessageEvent) => {
        if (event.data.source === 'iframe-console') {
            const { type, message } = event.data;
            const messageString = message.map((m: any) => {
              if (typeof m === 'object' && m !== null) {
                if (m.message && m.stack) { // It's an error object
                  return `${m.message}\n${m.stack}`;
                }
                return JSON.stringify(m, null, 2);
              }
              return String(m);
            }).join(' ');

            setLogs(prevLogs => [...prevLogs, { type, message: messageString, timestamp: new Date().toLocaleTimeString() }]);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [handleMessage]);

    useEffect(() => {
        const savedProjects = localStorage.getItem('web-ide-projects');
        if (savedProjects) {
            setProjects(JSON.parse(savedProjects));
        }
    }, []);

    const saveProjectsToLocalStorage = (newProjects: Project[]) => {
        setProjects(newProjects);
        localStorage.setItem('web-ide-projects', JSON.stringify(newProjects));
    };

    const runPreview = () => setSrcDoc(generateSrcDoc());

    const createBlob = (content: string, type: string) => new Blob([content], { type });

    const triggerDownload = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownload = (type: 'html' | 'css' | 'js' | 'single-html' | 'zip' | 'png') => {
        switch (type) {
            case 'html': {
                const content = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n${htmlCode}\n  <script src="script.js" defer></script>\n</body>\n</html>`;
                triggerDownload(createBlob(content, 'text/html'), 'index.html');
                break;
            }
            case 'css':
                triggerDownload(createBlob(cssCode, 'text/css'), 'styles.css');
                break;
            case 'js':
                triggerDownload(createBlob(jsCode, 'text/javascript'), 'script.js');
                break;
            case 'single-html': {
                const content = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n  <style>${cssCode}</style>\n</head>\n<body>\n${htmlCode}\n  <script>${jsCode}</script>\n</body>\n</html>`;
                triggerDownload(createBlob(content, 'text/html'), 'index.html');
                break;
            }
            case 'zip': {
                const zip = new JSZip();
                const htmlContent = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n${htmlCode}\n  <script src="script.js" defer></script>\n</body>\n</html>`;
                zip.file("index.html", htmlContent);
                zip.file("styles.css", cssCode);
                zip.file("script.js", jsCode);
                zip.file("README.md", "Project generated by Live Web IDE.");
                zip.generateAsync({ type: "blob" }).then((content: Blob) => {
                    triggerDownload(content, "web-project.zip");
                });
                break;
            }
            case 'png': {
                if (previewIframeRef.current && previewIframeRef.current.contentWindow) {
                    html2canvas(previewIframeRef.current.contentWindow.document.body, { allowTaint: true, useCORS: true }).then((canvas: HTMLCanvasElement) => {
                        const link = document.createElement('a');
                        link.download = `preview-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`;
                        link.href = canvas.toDataURL();
                        link.click();
                    }).catch((err: Error) => {
                        alert("Could not take screenshot. If you are using external resources, they may be blocked by CORS policy.");
                        console.error(err);
                    });
                }
                break;
            }
        }
    };
    
    const handleSaveProject = (name: string) => {
        if (!name.trim()) {
            alert("Project name cannot be empty.");
            return;
        }

        const projectData = { html: htmlCode, css: cssCode, js: jsCode, externalResources };

        if (activeProject) {
            const updatedProject = { ...activeProject, ...projectData, name };
            const newProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
            saveProjectsToLocalStorage(newProjects);
            setActiveProject(updatedProject);
        } else {
            const newProject: Project = { ...projectData, name, id: Date.now().toString() };
            saveProjectsToLocalStorage([...projects, newProject]);
            setActiveProject(newProject);
        }
    };

    const handleLoadProject = (project: Project) => {
        setHtmlCode(project.html);
        setCssCode(project.css);
        setJsCode(project.js);
        setExternalResources(project.externalResources);
        setActiveProject(project);
        setProjectsModalOpen(false);
    };

    const handleDeleteProject = (projectId: string) => {
        const newProjects = projects.filter(p => p.id !== projectId);
        saveProjectsToLocalStorage(newProjects);
        if (activeProject && activeProject.id === projectId) {
            setActiveProject(null);
        }
    };

    const handleNewProject = () => {
      setHtmlCode(DEFAULT_PROJECT.html);
      setCssCode(DEFAULT_PROJECT.css);
      setJsCode(DEFAULT_PROJECT.js);
      setExternalResources(DEFAULT_PROJECT.externalResources);
      setActiveProject(null);
      setProjectsModalOpen(false);
    }
    
    const startResize = useCallback((e: React.MouseEvent) => {
        isResizing.current = true;
    }, []);

    const stopResize = useCallback(() => {
        isResizing.current = false;
    }, []);

    const onResize = useCallback((e: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 10 && newWidth < 90) {
            setEditorWidth(newWidth);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', onResize);
        window.addEventListener('mouseup', stopResize);
        return () => {
            window.removeEventListener('mousemove', onResize);
            window.removeEventListener('mouseup', stopResize);
        };
    }, [onResize, stopResize]);


    return (
        <div className="h-screen w-screen flex flex-col bg-gray-800 text-gray-200 font-sans">
            {isProjectsModalOpen && (
                <ProjectsModal
                    projects={projects}
                    onLoad={handleLoadProject}
                    onSave={handleSaveProject}
                    onDelete={handleDeleteProject}
                    onNew={handleNewProject}
                    activeProject={activeProject}
                    onClose={() => setProjectsModalOpen(false)}
                />
            )}
            {isHelpModalOpen && <HelpModal onClose={() => setHelpModalOpen(false)} />}
            {isResourcesModalOpen && (
                <ExternalResourcesModal 
                    resources={externalResources} 
                    onSave={setExternalResources} 
                    onClose={() => setResourcesModalOpen(false)} 
                />
            )}
            <Toolbar
                onRun={runPreview}
                onDownload={handleDownload}
                onSave={() => setProjectsModalOpen(true)}
                onLoad={() => setProjectsModalOpen(true)}
                onToggleLayout={() => setLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')}
                onHelp={() => setHelpModalOpen(true)}
                onResources={() => setResourcesModalOpen(true)}
            />
            <main className={`flex-grow flex ${layout === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
                <div style={layout === 'horizontal' ? { width: `${editorWidth}%` } : { height: '50%' }}>
                    <EditorPanel
                        htmlCode={htmlCode}
                        cssCode={cssCode}
                        jsCode={jsCode}
                        setHtmlCode={setHtmlCode}
                        setCssCode={setCssCode}
                        setJsCode={setJsCode}
                    />
                </div>
                {layout === 'horizontal' && (
                    <div
                        className="w-2 cursor-col-resize bg-gray-700 hover:bg-blue-500 transition-colors"
                        onMouseDown={startResize}
                    ></div>
                )}
                <div className="flex-grow">
                    <PreviewPanel srcDoc={srcDoc} logs={logs} iframeRef={previewIframeRef} />
                </div>
            </main>
        </div>
    );
};

export default App;
