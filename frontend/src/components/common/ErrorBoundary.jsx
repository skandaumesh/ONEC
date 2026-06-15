import { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
 constructor(props) {
 super(props);
 this.state = { hasError: false, error: null, errorInfo: null };
 }

 static getDerivedStateFromError(error) {
 return { hasError: true };
 }

 componentDidCatch(error, errorInfo) {
 this.setState({
 error,
 errorInfo
 });
 console.error('Error caught by boundary:', error, errorInfo);
 }

 resetError = () => {
 this.setState({ hasError: false, error: null, errorInfo: null });
 };

 render() {
 if (this.state.hasError) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
 <div className="card max-w-md w-full text-center">
 <div className="flex justify-center mb-4">
 <AlertCircle size={48} className="text-[var(--color-danger)]" />
 </div>
 <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
 Oops! Something went wrong
 </h2>
 <p className="text-[var(--text-secondary)] mb-4">
 We encountered an unexpected error. Please try refreshing the page.
 </p>
 {process.env.NODE_ENV === 'development' && this.state.error && (
 <details className="text-left mb-4 p-3 bg-[var(--bg-primary)] rounded text-xs">
 <summary className="cursor-pointer font-semibold mb-2">Error Details</summary>
 <pre className="whitespace-pre-wrap overflow-auto max-h-48">
 {this.state.error.toString()}
 </pre>
 </details>
 )}
 <button
 onClick={this.resetError}
 className="btn btn-primary w-full flex items-center justify-center gap-2"
 >
 <RefreshCw size={16} />
 Try Again
 </button>
 </div>
 </div>
 );
 }

 return this.props.children;
 }
}
