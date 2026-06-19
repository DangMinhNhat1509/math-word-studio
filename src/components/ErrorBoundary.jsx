import { Component } from 'react';
import { Alert, Box } from '@mantine/core';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p="md">
          <Alert icon={<AlertCircle size={16} />} color="red" title="Đã xảy ra lỗi">
            {this.state.error?.message || 'Có lỗi không xác định xảy ra'}
            <Box size="xs" mt="sm" c="dimmed">
              Vui lòng tải lại trang nếu vấn đề tiếp tục
            </Box>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
