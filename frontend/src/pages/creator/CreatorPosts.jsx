import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { usePosts } from '../../hooks/postHook';
import { useAuth } from '../../hooks/authHook';
import CreatePostInput from '../../components/creator/posts/CreatePostInput';
import PostsCards from '../../components/creator/posts/PostsCards';

/**
 * Creator Posts Page
 * Shows all posts from all creators with lazy loading
 * Includes "What's on your mind?" input for creators
 */
const CreatorPosts = () => {
  const { user } = useAuth();
  const {
    allPosts,
    allPostsPagination,
    allPostsLoading,
    allPostsError,
    getAllPosts,
  } = usePosts();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTargetRef = useRef(null);

  const limit = 10; // Posts per page

  // Check if user is a creator
  const isCreator = user?.role === 'creator';

  // Initial load
  useEffect(() => {
    const loadPosts = async () => {
      try {
        await getAllPosts({ page: 1, limit });
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    };

    loadPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update hasMore based on pagination
  useEffect(() => {
    if (allPostsPagination) {
      const { currentPage, totalPages } = allPostsPagination;
      setHasMore(currentPage < totalPages);
    }
  }, [allPostsPagination]);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      await getAllPosts({ page: nextPage, limit });
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore, getAllPosts, limit]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!hasMore || isLoadingMore || allPostsLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoadingMore && !allPostsLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = observerTargetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, allPostsLoading, loadMorePosts]);

  // Handle post creation success
  const handlePostCreated = useCallback(async () => {
    // Reload posts from the beginning
    setPage(1);
    setHasMore(true);
    try {
      await getAllPosts({ page: 1, limit });
    } catch (error) {
      console.error('Failed to reload posts:', error);
    }
  }, [getAllPosts, limit]);

  // Handle post update/delete
  const handlePostUpdated = useCallback(async () => {
    // Reload current page
    try {
      await getAllPosts({ page, limit });
    } catch (error) {
      console.error('Failed to reload posts:', error);
    }
  }, [page, getAllPosts, limit]);

  const handlePostDeleted = useCallback(async () => {
    // Reload current page
    try {
      await getAllPosts({ page, limit });
    } catch (error) {
      console.error('Failed to reload posts:', error);
    }
  }, [page, getAllPosts, limit]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--theme-bg)',
        py: 4,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          {/* Create Post Input (only for creators) */}
          {isCreator && <CreatePostInput onPostCreated={handlePostCreated} />}

          {/* Loading State (Initial) */}
          {allPostsLoading && allPosts.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: 'var(--theme-primary)' }} />
            </Box>
          )}

          {/* Error State */}
          {allPostsError && allPosts.length === 0 && (
            <Alert
              severity="error"
              sx={{
                backgroundColor: 'var(--theme-bg-secondary)',
                color: 'var(--theme-error)',
                mb: 3,
              }}
            >
              {allPostsError}
            </Alert>
          )}

          {/* Posts List */}
          {allPosts.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {allPosts.map((post, index) => (
                <PostsCards
                  key={post._id || index}
                  post={post}
                  onPostUpdated={handlePostUpdated}
                  onPostDeleted={handlePostDeleted}
                />
              ))}
            </Box>
          )}

          {/* Loading More Indicator */}
          {(isLoadingMore || (allPostsLoading && allPosts.length > 0)) && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4,
              }}
            >
              <CircularProgress size={32} sx={{ color: 'var(--theme-primary)' }} />
            </Box>
          )}

          {/* End of Posts Message */}
          {!hasMore && allPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  px: 3,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--theme-text-muted)',
                    fontStyle: 'italic',
                  }}
                >
                  You've reached the end of the posts
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* Empty State */}
          {!allPostsLoading && allPosts.length === 0 && !allPostsError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 3,
                  backgroundColor: 'var(--theme-bg-card)',
                  borderRadius: '16px',
                  border: '1px dashed var(--theme-border)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'var(--theme-text)',
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  No posts yet
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--theme-text-secondary)',
                  }}
                >
                  {isCreator
                    ? 'Be the first to create a post!'
                    : 'No posts available at the moment. Check back later!'}
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* Intersection Observer Target (hidden, only when hasMore) */}
          {hasMore && !isLoadingMore && (
            <Box
              ref={observerTargetRef}
              sx={{
                height: 20,
                width: '100%',
              }}
            />
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default CreatorPosts;